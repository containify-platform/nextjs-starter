# Next.js starter

A minimal [Next.js](https://nextjs.org/) app (App Router, `standalone` output) with Postgres,
ready to deploy on [Containify](https://containify.cloud).

- `app/page.tsx`: a home page that counts its visits in Postgres
- `app/health/route.ts`: `GET /health`, the health check
- `lib/db.ts`: a [postgres.js](https://github.com/porsager/postgres) client reading `DATABASE_URL`
- `migrations/*.sql` and `scripts/migrate.mjs`: plain SQL migrations, applied once each in name order
- `Dockerfile`: a multi-stage build of the standalone server, running as a non-root user

## Run locally

You need Node.js 24 and a Postgres database.

```bash
npm install
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app
node scripts/migrate.mjs
npm run dev
```

Open http://localhost:3000.

## Deploy on Containify

Deploy the **Next.js starter** template from the Containify catalogue. It adds this app, built
from its Dockerfile, and a private Postgres database, with `DATABASE_URL` already set and
`node scripts/migrate.mjs` as the pre-deploy command, so migrations run before each release
takes traffic.

To deploy your own copy, fork or copy this repository, then add it to a project as a
**Git Repository** app with an HTTP endpoint on port `3000`, a health check on `/health`, and
`DATABASE_URL` set to `{{ "Postgres".DATABASE_URL }}`. See the
[Next.js guide](https://containify.cloud/docs/guides/nextjs).

The Dockerfile sets `HOSTNAME=::`, so the server listens on every interface, and `PORT=3000`.
`NEXT_PUBLIC_` variables are baked in at build time: declare each one with `ARG` in the
Dockerfile's build stage.

## License

MIT
