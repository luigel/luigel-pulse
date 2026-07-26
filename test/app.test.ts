import { describe, expect, it } from 'vitest';

import { app } from '../src/app.js';

describe('LUIGEL Pulse walking skeleton', () => {
  it('GET /health returns 200 OK', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('OK');
  });

  it('GET /api/version reports status ok', async () => {
    const res = await app.request('/api/version');
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      name: string;
      version: string;
      status: string;
    };
    expect(body).toMatchObject({ status: 'ok', name: 'LUIGEL Pulse' });
    expect(typeof body.version).toBe('string');
  });

  it('GET / serves the landing page', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');
    expect(await res.text()).toContain('LUIGEL');
  });

  it('unknown routes return 404', async () => {
    const res = await app.request('/does-not-exist');
    expect(res.status).toBe(404);
  });
});
