// Render render.html to entry.png (1024x1024) with headless Chromium.
// Usage: node shoot.mjs [out.png]
// Uses playwright-core from the shared fps-tools install and the cached
// headless-shell Chromium, so nothing needs to be downloaded.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE_PATH
  ?? resolve(process.env.HOME, 'workspace/makefun/fps-tools/node_modules/playwright-core'));
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const out = resolve(dir, process.argv[2] ?? 'entry.png');
const shell = process.env.CHROMIUM_HEADLESS_SHELL
  ?? resolve(process.env.HOME, '.cache/ms-playwright/chromium_headless_shell-1148/chrome-linux/headless_shell');

const browser = await chromium.launch({ executablePath: shell, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
await page.goto('file://' + resolve(dir, 'render.html'));
await page.waitForTimeout(400);
await page.screenshot({ path: out });
await browser.close();
console.log('wrote', out);
