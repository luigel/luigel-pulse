import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { app } from '../src/app.js';

/**
 * Build the static site published to GitHub Pages (the M1 walking-skeleton
 * host — the only production target we can fully automate with the GitHub
 * token alone; see the architecture note on LUI-8).
 *
 * Each output file is rendered *from the real Hono app* via `app.request()`,
 * so the deployed `/health` returns exactly what the application returns. When
 * the dynamic app moves to a serverless runtime (M2+), the same routes serve
 * live instead of being pre-rendered.
 */
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, 'dist');

/** Route path -> output file (relative to dist). */
const routes: Record<string, string> = {
  '/': 'index.html',
  '/health': 'health',
  '/api/version': 'api/version',
};

async function render(path: string, outFile: string): Promise<void> {
  const res = await app.request(path);
  if (res.status !== 200) {
    throw new Error(`Route ${path} returned ${res.status}, expected 200`);
  }
  const body = await res.text();
  const dest = join(outDir, outFile);
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, body);
  // eslint-disable-next-line no-console
  console.log(`  ${path.padEnd(16)} -> dist/${outFile} (${body.length} bytes)`);
}

async function main(): Promise<void> {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  // Disable Jekyll so files (including the extensionless `health`) are served
  // verbatim.
  await writeFile(join(outDir, '.nojekyll'), '');

  // eslint-disable-next-line no-console
  console.log('Building static site -> dist/');
  for (const [path, outFile] of Object.entries(routes)) {
    await render(path, outFile);
  }
  // eslint-disable-next-line no-console
  console.log('Done.');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
