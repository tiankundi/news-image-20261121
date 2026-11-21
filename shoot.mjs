// Render render.html to entry.png (1024x1024) with headless Chromium.
// Usage: node shoot.mjs [out.png]
// Calls the cached headless-shell Chromium binary directly with
// --screenshot, so no browser library is needed at all.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';

const dir = dirname(fileURLToPath(import.meta.url));
const out = resolve(dir, process.argv[2] ?? 'entry.png');
const page = 'file://' + resolve(dir, 'render.html');
const shell = process.env.CHROMIUM_HEADLESS_SHELL
  ?? resolve(process.env.HOME, '.cache/ms-playwright/chromium_headless_shell-1148/chrome-linux/headless_shell');

if (!existsSync(shell)) {
  throw new Error('headless Chromium shell not found at ' + shell);
}

execFileSync(shell, [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--window-size=1024,1024',
  '--screenshot=' + out,
  page,
], { stdio: 'inherit' });

console.log('wrote', out);
