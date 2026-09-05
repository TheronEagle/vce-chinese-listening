#!/usr/bin/env python3
"""Generate TTS audio for VCE Chinese listening exercises.

Single source of truth: src/data/*.ts
This script parses the TypeScript exercise data directly so audio always matches
the current dialogue. It does NOT maintain a separate Python dialogue dictionary.

Usage:
    python3 scripts/generate-audio.py                 # all exercises, missing files only
    python3 scripts/generate-audio.py --ex ex-008    # specific exercise, missing files only
    python3 scripts/generate-audio.py --ex ex-004 --force   # regenerate all for ex-004
    python3 scripts/generate-audio.py --dry-run      # show what would be generated

Edge-tts must be installed in the active Python:
    python3 -m pip install edge-tts

Voice mapping:
    Speaker A (or 'narrator') -> zh-CN-XiaoxiaoNeural (female)
    Speaker B                  -> zh-CN-YunxiNeural    (male)

Output:
    public/audio/<exerciseId>/line-NN.mp3   (one per dialogue line)
    public/audio/<exerciseId>/full.mp3     (entire dialogue as one file, female voice)
"""
import argparse
import asyncio
import os
import re
import sys
from typing import Optional

# Voice mapping (consistent with the previous generator scripts)
VOICE_A = "zh-CN-XiaoxiaoNeural"   # female
VOICE_B = "zh-CN-YunxiNeural"      # male
VOICE_NARRATOR = "zh-CN-XiaoxiaoNeural"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
OUTPUT_DIR = os.path.join(REPO_ROOT, "public", "audio")

DATA_FILES = [
    "src/data/sample-exercises.ts",
    "src/data/more-exercises.ts",
    "src/data/exercises-batch3.ts",
    "src/data/exercises-batch4.ts",
    "src/data/exercises-career-school.ts",
]


# ---------------------------------------------------------------------------
# TypeScript dialogue parser
# ---------------------------------------------------------------------------

def parse_exercise(file_path: str, ex_id: str) -> Optional[dict]:
    """Parse a single exercise block from a TS data file.

    Returns dict with keys: id, title, dialogue (list of {speaker, chinese}).
    Returns None if ex_id not found in this file.
    """
    with open(file_path, "r", encoding="utf-8") as f:
        src = f.read()

    # Find the exercise block by id
    # We look for:  id: 'ex-XXX'  then capture the body up to the next id or end
    pattern = re.compile(
        r"id:\s*['\"](" + re.escape(ex_id) + r")['\"]",
    )
    m = pattern.search(src)
    if not m:
        return None

    start = m.end()
    # Find the end of this exercise block. Stop at the next "id: 'ex-" or the closing "]"
    # of the SAMPLE_EXERCISES array. Use brace balance to be robust.
    # We just take everything until the next exercise id or end of file.
    next_id = re.search(r"id:\s*['\"]ex-\d+['\"]", src[start:])
    end = start + next_id.start() if next_id else len(src)
    body = src[start:end]

    # Extract title
    title_match = re.search(r"title:\s*['\"]([^'\"]+)['\"]", body)
    title = title_match.group(1) if title_match else "(no title)"

    # Extract dialogue array: dialogue: [ ... ], vocabulary:
    # We need to handle nested braces. Find "dialogue:" then walk braces.
    dialogue_start = body.find("dialogue:")
    if dialogue_start < 0:
        return None
    # Find opening [
    bracket_start = body.find("[", dialogue_start)
    if bracket_start < 0:
        return None
    # Walk to matching ]
    depth = 0
    i = bracket_start
    while i < len(body):
        c = body[i]
        if c == "[":
            depth += 1
        elif c == "]":
            depth -= 1
            if depth == 0:
                break
        # Skip over string contents (very simple: find next quote)
        elif c == "'" or c == '"' or c == "`":
            quote = c
            i += 1
            while i < len(body):
                if body[i] == "\\" and i + 1 < len(body):
                    i += 2
                    continue
                if body[i] == quote:
                    break
                i += 1
        i += 1
    dialogue_body = body[bracket_start + 1 : i]

    # Parse dialogue entries: { speaker: 'A', speakerName: '...', chinese: '...', pinyin: '...', english: '...' }
    # Split by top-level "}," patterns
    entries = []
    pos = 0
    while pos < len(dialogue_body):
        # Find next "{"
        obj_start = dialogue_body.find("{", pos)
        if obj_start < 0:
            break
        # Find matching "}" respecting strings
        depth = 0
        i = obj_start
        while i < len(dialogue_body):
            c = dialogue_body[i]
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    break
            elif c == "'" or c == '"' or c == "`":
                quote = c
                i += 1
                while i < len(dialogue_body):
                    if dialogue_body[i] == "\\" and i + 1 < len(dialogue_body):
                        i += 2
                        continue
                    if dialogue_body[i] == quote:
                        break
                    i += 1
            i += 1
        entry_src = dialogue_body[obj_start : i + 1]

        # Extract speaker and chinese
        speaker_match = re.search(r"speaker:\s*['\"]([ABnarrator]+)['\"]", entry_src)
        chinese_match = re.search(r"chinese:\s*['\"]([^'\"]+)['\"]", entry_src)
        if speaker_match and chinese_match:
            entries.append({
                "speaker": speaker_match.group(1),
                "chinese": chinese_match.group(1),
            })
        # Move past this object (allow trailing comma)
        pos = i + 1

    return {"id": ex_id, "title": title, "dialogue": entries, "file": file_path}


def find_exercise(ex_id: str) -> Optional[dict]:
    """Find an exercise across all data files."""
    for rel in DATA_FILES:
        path = os.path.join(REPO_ROOT, rel)
        if not os.path.exists(path):
            continue
        ex = parse_exercise(path, ex_id)
        if ex is not None and ex["dialogue"]:
            return ex
    return None


def list_all_exercise_ids() -> list[str]:
    """Return all exercise IDs found in data files."""
    ids: set[str] = set()
    for rel in DATA_FILES:
        path = os.path.join(REPO_ROOT, rel)
        if not os.path.exists(path):
            continue
        with open(path, "r", encoding="utf-8") as f:
            src = f.read()
        for m in re.finditer(r"id:\s*['\"](ex-\d+)['\"]", src):
            ids.add(m.group(1))
    return sorted(ids)


# ---------------------------------------------------------------------------
# Audio generation
# ---------------------------------------------------------------------------

def voice_for_speaker(speaker: str) -> str:
    if speaker == "B":
        return VOICE_B
    return VOICE_A  # A and narrator both use female voice


async def generate_one(text: str, voice: str, out_path: str) -> bool:
    """Run edge-tts to synthesize one MP3. Returns True on success."""
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    try:
        proc = await asyncio.create_subprocess_exec(
            sys.executable, "-m", "edge_tts",
            "--voice", voice,
            "--text", text,
            "--write-media", out_path,
            stdout=asyncio.subprocess.DEVNULL,
            stderr=asyncio.subprocess.PIPE,
        )
        _, stderr = await proc.communicate()
        if proc.returncode != 0:
            print(f"    ERROR (rc={proc.returncode}): {stderr.decode(errors='replace').strip()[:200]}")
            return False
        return os.path.exists(out_path) and os.path.getsize(out_path) > 0
    except Exception as e:
        print(f"    ERROR: {e}")
        return False


async def generate_exercise(ex: dict, force: bool = False, dry_run: bool = False) -> dict:
    """Generate all audio for one exercise. Returns a result dict."""
    ex_id = ex["id"]
    ex_dir = os.path.join(OUTPUT_DIR, ex_id)
    os.makedirs(ex_dir, exist_ok=True)

    result = {"id": ex_id, "generated": [], "skipped": [], "failed": []}

    # Per-line files
    for idx, line in enumerate(ex["dialogue"]):
        out_path = os.path.join(ex_dir, f"line-{idx:02d}.mp3")
        if os.path.exists(out_path) and not force:
            result["skipped"].append(out_path)
            continue
        voice = voice_for_speaker(line["speaker"])
        text = line["chinese"]
        if dry_run:
            print(f"    [DRY] would generate {os.path.relpath(out_path, REPO_ROOT)}  voice={voice}")
            result["generated"].append(out_path)
            continue
        print(f"    [{idx:02d}] {line['speaker']}: {text[:40]}{'...' if len(text)>40 else ''}")
        ok = await generate_one(text, voice, out_path)
        if ok:
            result["generated"].append(out_path)
        else:
            result["failed"].append(out_path)

    # full.mp3 — concatenate all dialogue lines as a single text, female voice
    full_path = os.path.join(ex_dir, "full.mp3")
    if not os.path.exists(full_path) or force:
        full_text = "\n".join(l["chinese"] for l in ex["dialogue"])
        if dry_run:
            print(f"    [DRY] would generate {os.path.relpath(full_path, REPO_ROOT)}")
            result["generated"].append(full_path)
        else:
            print(f"    [full] {len(full_text)} chars")
            ok = await generate_one(full_text, VOICE_A, full_path)
            if ok:
                result["generated"].append(full_path)
            else:
                result["failed"].append(full_path)
    else:
        result["skipped"].append(full_path)

    return result


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

async def main_async():
    ap = argparse.ArgumentParser(description="Generate TTS audio from TypeScript exercise data.")
    ap.add_argument("--ex", help="Specific exercise ID to generate (e.g. ex-008). Default: all.")
    ap.add_argument("--force", action="store_true",
    help="Regenerate even if files exist (overwrites existing audio).")
    ap.add_argument("--dry-run", action="store_true",
    help="Show what would be generated without writing files.")
    args = ap.parse_args()

    if args.ex:
        ex = find_exercise(args.ex)
        if ex is None:
            print(f"ERROR: exercise {args.ex} not found in any data file.", file=sys.stderr)
            return 1
        print(f"[{ex['id']}] {ex['title']}  ({len(ex['dialogue'])} lines, source: {os.path.basename(ex['file'])})")
        result = await generate_exercise(ex, force=args.force, dry_run=args.dry_run)
    else:
        all_ids = list_all_exercise_ids()
        print(f"Found {len(all_ids)} exercises in src/data/*.ts")
        print(f"Output directory: {os.path.relpath(OUTPUT_DIR, REPO_ROOT)}")
        print()
        results = []
        for ex_id in all_ids:
            ex = find_exercise(ex_id)
            if ex is None:
                print(f"[{ex_id}] NOT FOUND in data files, skipping")
                continue
            print(f"[{ex_id}] {ex['title']}  ({len(ex['dialogue'])} lines)")
            r = await generate_exercise(ex, force=args.force, dry_run=args.dry_run)
            results.append(r)
            print()
        # Summary
        total_gen = sum(len(r["generated"]) for r in results)
        total_skip = sum(len(r["skipped"]) for r in results)
        total_fail = sum(len(r["failed"]) for r in results)
        print(f"Summary: {total_gen} generated, {total_skip} skipped (existing), {total_fail} failed")
        return 1 if total_fail else 0

    # Single-exercise summary
    print(f"  Generated: {len(result['generated'])}")
    print(f"  Skipped:   {len(result['skipped'])}")
    print(f"  Failed:    {len(result['failed'])}")
    return 1 if result["failed"] else 0


def main():
    return asyncio.run(main_async())


if __name__ == "__main__":
    sys.exit(main() or 0)