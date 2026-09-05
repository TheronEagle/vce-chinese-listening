import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import * as path from 'node:path';

/**
 * Integration test: invokes the actual audio verifier script and
 * confirms it reports the project is aligned. This guards against
 * any future change that breaks audio/data alignment.
 */
describe('audio alignment verifier', () => {
  it('reports 18/18 exercises aligned', () => {
    const script = path.resolve(__dirname, '..', '..', 'scripts', 'verify-audio.ts');
    // node --experimental-strip-types so we can run TS directly.
    const result = execSync(
      `node --experimental-strip-types --no-warnings ${JSON.stringify(script)}`,
      { encoding: 'utf8', cwd: path.resolve(__dirname, '..', '..') },
    );
    expect(result).toMatch(/Result: 18\/18 exercises aligned/);
    expect(result).toMatch(/All exercises aligned/);
  }, 30_000);
});