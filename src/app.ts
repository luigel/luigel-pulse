import { Hono } from 'hono';

import { APP_NAME, VERSION } from './version.js';

/**
 * The core LUIGEL Pulse application.
 *
 * Hono is a small, standards-based (Web Fetch API) framework that runs
 * unchanged on Node.js, Cloudflare Workers, and Deno. Building on it now means
 * the same app code carries forward to the serverless runtime we adopt for the
 * dynamic product (see the architecture note on LUI-8) without a rewrite.
 */
export const app = new Hono();

/**
 * Liveness/health probe. Returns 200 with a plain-text body so uptime checks
 * (including, eventually, Pulse itself) can assert on both status and body.
 */
app.get('/health', (c) => c.text('OK'));

/** Machine-readable version/health detail. */
app.get('/api/version', (c) =>
  c.json({ name: APP_NAME, version: VERSION, status: 'ok' }),
);

/** Public landing page for the walking skeleton. */
app.get('/', (c) =>
  c.html(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${APP_NAME}</title>
    <style>
      :root { color-scheme: light dark; }
      body {
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        max-width: 40rem; margin: 12vh auto; padding: 0 1.5rem; line-height: 1.6;
      }
      h1 { font-size: 2rem; margin-bottom: 0.25rem; }
      .tag { color: #16a34a; font-weight: 600; }
      code { background: rgba(127,127,127,0.15); padding: 0.15em 0.4em; border-radius: 4px; }
      footer { margin-top: 3rem; font-size: 0.85rem; opacity: 0.7; }
    </style>
  </head>
  <body>
    <h1>LUIGEL <span class="tag">Pulse</span></h1>
    <p>Lightweight uptime monitoring &amp; status pages for small teams.</p>
    <p>This is the walking skeleton (M1). Health probe: <code>/health</code>.</p>
    <footer>v${VERSION} · deployed automatically from <code>main</code>.</footer>
  </body>
</html>`,
  ),
);

export default app;
