// news-image-20261121 entry (Node 22, standard library only).
// The image is the entry.png beside this file; the program copies it to
// the output directory byte for byte, so repeated runs are identical.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const src = join(here, 'entry.png');

// Fail loudly if the image is not a whole PNG (magic bytes 89 50 4E 47)
// or if it breaks the competition's size cap of 1 MiB.
const bytes = readFileSync(src);
const head = bytes.subarray(0, 4);
if (head[0] !== 0x89 || head[1] !== 0x50 || head[2] !== 0x4e || head[3] !== 0x47) {
  throw new Error('entry.png is not a PNG file');
}
if (bytes.length > 1048576) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB cap`);
}
mkdirSync(outDir, { recursive: true });
const dest = join(outDir, 'entry.png');
copyFileSync(src, dest);

// Read the copy back and confirm it is byte for byte the source:
// a run that writes different bytes is a broken run.
const written = readFileSync(dest);
if (written.length !== bytes.length || !written.equals(bytes)) {
  throw new Error('copied entry.png does not match the source byte for byte');
}
console.log(`wrote ${dest} (${written.length} bytes)`);
