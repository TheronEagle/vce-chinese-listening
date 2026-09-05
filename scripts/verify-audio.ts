#!/usr/bin/env -S npx tsx
/**
 * verify-audio.ts — Audio/data alignment verifier
 *
 * For every exercise in src/data/*.ts, checks that every dialogue line index N
 * has a corresponding public/audio/<exerciseId>/line-NN.mp3 file.
 *
 * Also checks full.mp3 exists for every exercise.
 *
 * Run: npx tsx scripts/verify-audio.ts
 * Exit code: 0 on pass, 1 on any mismatch.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DATA_FILES = [
  'src/data/sample-exercises.ts',
  'src/data/more-exercises.ts',
  'src/data/exercises-batch3.ts',
  'src/data/exercises-batch4.ts',
  'src/data/exercises-career-school.ts',
];

interface ExerciseBlock {
  id: string;
  file: string;
  dialogueCount: number;
}

/** Parse exercise blocks from a TS data file. Counts dialogue lines per exercise. */
function parseExercises(file: string): ExerciseBlock[] {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const blocks: ExerciseBlock[] = [];
  const idMatches = [...src.matchAll(/id:\s*['"](ex-\d+)['"]/g)];
  for (let i = 0; i < idMatches.length; i++) {
    const id = idMatches[i][1];
    const start = idMatches[i].index! + idMatches[i][0].length;
    const end = i + 1 < idMatches.length ? idMatches[i + 1].index! : src.length;
    const body = src.slice(start, end);
    // Find the dialogue: [...] array within the body, up to "vocabulary:" marker
    const dialogueMatch = body.match(/dialogue:\s*\[(.*?)\],\s*vocabulary:/s);
    if (!dialogueMatch) continue;
    // Count "{ speaker:" occurrences — these are individual dialogue lines
    const dialogueCount = (dialogueMatch[1].match(/\{\s*speaker:/g) || []).length;
    blocks.push({ id, file, dialogueCount });
  }
  return blocks;
}

function checkExists(p: string): boolean {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

function main(): void {
  const allBlocks: ExerciseBlock[] = [];
  for (const f of DATA_FILES) {
    allBlocks.push(...parseExercises(f));
  }

  // Deduplicate by id (in case same id appears in multiple files, though it shouldn't)
  const byId = new Map<string, ExerciseBlock>();
  for (const b of allBlocks) {
    if (byId.has(b.id)) {
      const existing = byId.get(b.id)!;
      // Keep the one with more dialogue lines (signals the active data)
      if (b.dialogueCount > existing.dialogueCount) byId.set(b.id, b);
    } else {
      byId.set(b.id, b);
    }
  }

  const exercises = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));

  let failed = 0;
  const report: string[] = [];

  for (const ex of exercises) {
    const exDir = path.join(ROOT, 'public', 'audio', ex.id);
    const errors: string[] = [];

    if (!fs.existsSync(exDir)) {
      errors.push('audio directory missing');
    } else {
      // Check full.mp3
      if (!checkExists(path.join(exDir, 'full.mp3'))) {
        errors.push('missing full.mp3');
      }
      // Check line-00..line-(N-1).mp3
      for (let i = 0; i < ex.dialogueCount; i++) {
        const lineFile = `line-${String(i).padStart(2, '0')}.mp3`;
        if (!checkExists(path.join(exDir, lineFile))) {
          errors.push(`missing ${lineFile}`);
        }
      }
      // Also report orphaned audio files (line-NN.mp3 with no matching dialogue line)
      const audioFiles = fs.readdirSync(exDir).filter(f => /^line-\d{2}\.mp3$/.test(f));
      for (const f of audioFiles) {
        const idx = parseInt(f.match(/line-(\d{2})\.mp3/)![1], 10);
        if (idx >= ex.dialogueCount) {
          errors.push(`orphaned ${f} (no dialogue line ${idx})`);
        }
      }
    }

    if (errors.length > 0) {
      failed++;
      report.push(`✗ ${ex.id}  (${ex.dialogueCount} dialogue lines, ${ex.file.split('/').pop()})`);
      for (const e of errors) report.push(`    ${e}`);
    } else {
      report.push(`✓ ${ex.id}  (${ex.dialogueCount} dialogue lines)`);
    }
  }

  console.log('Audio/data alignment report:');
  console.log('============================');
  console.log(report.join('\n'));
  console.log('');
  console.log(`Result: ${exercises.length - failed}/${exercises.length} exercises aligned.`);

  if (failed > 0) {
    console.error(`\n❌ ${failed} exercise(s) failed verification.`);
    process.exit(1);
  } else {
    console.log('\n✅ All exercises aligned.');
  }
}

main();