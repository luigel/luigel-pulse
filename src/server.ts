import { serve } from '@hono/node-server';

import { app } from './app.js';
import { APP_NAME } from './version.js';

/**
 * Local development / Node runtime entrypoint.
 *
 * The dynamic product (M2+) is targeted at a serverless runtime (Cloudflare
 * Workers — see the architecture note), where Hono is invoked directly without
 * this file. This entrypoint keeps `npm run dev` / `npm start` working on Node.
 */
const port = Number(process.env.PORT ?? 3000);

serve({ fetch: app.fetch, port }, (info) => {
  // eslint-disable-next-line no-console
  console.log(`${APP_NAME} listening on http://localhost:${info.port}`);
});
