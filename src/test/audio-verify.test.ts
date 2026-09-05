import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import * as path from 'node:path';

/**
 * Integration test: invokes the actual audio verifier script and
 * confirms it reports the project is aligned. This guards against
 * any future change that breaks audio/data alignment.
 */
describe('audio alignment verifier', () => {
  it('reports all exercises aligned (N/N where N >= 18)', () => {
    const script = path.resolve(__dirname, '..', '..', 'scripts', 'verify-audio.ts');
    const result = execSync(
      `node --experimental-strip-types --no-warnings ${JSON.stringify(script)}`,
      { encoding: 'utf8', cwd: path.resolve(__dirname, '..', '..') },
    );
    // Match "Result: <N>/<N>" where N >= 18 (content library grows).
    const m = result.match(/Result: (\d+)\/(\d+) exercises aligned/);
    expect(m).not.toBeNull();
    expect(Number(m![1])).toBe(Number(m![2]));
    expect(Number(m![1])).toBeGreaterThanOrEqual(18);
    expect(result).toMatch(/All exercises aligned/);
  }, 30_000);
});