# LUIGEL Pulse

Lightweight uptime monitoring & status pages for small teams.

**Live (M1):** <https://luigel.github.io/luigel-pulse/> · health probe: <https://luigel.github.io/luigel-pulse/health>

Add the HTTP endpoints you care about; Pulse checks them on a schedule, records
up/down state and response time, emails you on state changes, and gives each
account a hosted public status page. Trivially simple to set up — under five
minutes from signup to first monitor.

This repository is the **M1 walking skeleton**: it proves the delivery pipeline
(repo → CI → auto-deploy → reachable production URL with a health probe). The
auth, check engine, alerting, and status-page features arrive in later
milestones (M2–M4).

## Stack

| Concern       | Choice                                                             |
| ------------- | ------------------------------------------------------------------ |
| Language      | TypeScript on Node.js (>= 22)                                      |
| App / routing | [Hono](https://hono.dev) — runs on Node **and** Cloudflare Workers |
| Tests         | [Vitest](https://vitest.dev)                                       |
| Lint / format | ESLint (flat config) + Prettier                                    |
| CI            | GitHub Actions (lint, typecheck, test on every push/PR)            |
| Deploy (M1)   | GitHub Pages, auto-deployed from `main`                            |
| Deploy (M2+)  | Cloudflare Workers + D1 (see architecture note)                    |

See the **architecture-note** document on issue **LUI-8** for the full rationale
(stack, hosting, database, and the M1→M2 hosting transition).

## Getting started

```bash
npm install        # install dependencies
npm run dev        # start the dev server at http://localhost:3000
```

## Endpoints

| Route          | Purpose                                          |
| -------------- | ------------------------------------------------ |
| `/`            | Landing page                                     |
| `/health`      | Liveness probe — returns `200 OK` with body `OK` |
| `/api/version` | JSON `{ name, version, status }`                 |

## Scripts

```bash
npm run dev          # watch-mode dev server (tsx)
npm start            # run the server once
npm test             # run the Vitest suite
npm run lint         # ESLint
npm run format       # Prettier (write)
npm run format:check # Prettier (check only — used in CI)
npm run typecheck    # tsc --noEmit
npm run build        # render the static site into ./dist (what Pages serves)
```

## How production works (M1)

`npm run build` renders each route **from the real Hono app** (via
`app.request()`) into `./dist`, including an extensionless `health` file so
`GET /health` returns `OK` in production. On every push to `main`, the
[deploy workflow](.github/workflows/deploy.yml) builds `./dist` and publishes it
to GitHub Pages. CI ([ci.yml](.github/workflows/ci.yml)) runs lint, typecheck,
tests, and a build check on every push and pull request; `main` is branch-
protected so a red build blocks the merge.

Production URL: <https://luigel.github.io/luigel-pulse/> — health: <https://luigel.github.io/luigel-pulse/health> (returns `200 OK`). Full details on issue **LUI-8**.
