#!/usr/bin/env python3
"""Generate TTS audio for VCE Chinese listening exercises.

Single source of truth: src/data/*.ts
This script parses the TypeScript exercise data directly so audio always matches
the current dialogue. It does NOT maintain a separate Python dialogue dictionary.

Usage:
    python3 scripts/generate-audio.py                          # all exercises, missing files only
    python3 scripts/generate-audio.py --ex ex-008              # specific exercise, missing files only
    python3 scripts/generate-audio.py --ex ex-004 --force      # regenerate ALL audio for ex-004
    python3 scripts/generate-audio.py --dry-run                # show what would be generated

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
import sys

# Allow importing the library module from the same directory.
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from _audio_lib import find_exercise, generate_exercise, list_all_exercise_ids, REPO_ROOT, OUTPUT_DIR  # noqa: E402


async def main_async() -> int:
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
        print(f"  Generated: {len(result['generated'])}")
        print(f"  Skipped:   {len(result['skipped'])}")
        print(f"  Failed:    {len(result['failed'])}")
        return 1 if result["failed"] else 0

    # All exercises
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

    total_gen = sum(len(r["generated"]) for r in results)
    total_skip = sum(len(r["skipped"]) for r in results)
    total_fail = sum(len(r["failed"]) for r in results)
    print(f"Summary: {total_gen} generated, {total_skip} skipped (existing), {total_fail} failed")
    return 1 if total_fail else 0


def main():
    return asyncio.run(main_async())


if __name__ == "__main__":
    sys.exit(main() or 0)