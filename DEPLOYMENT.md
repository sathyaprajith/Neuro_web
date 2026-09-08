# Neuro Paradigm deployment guide

## Architecture

The checked-in application is the public Vite site plus an Express contact API. Deploy both behind one trusted HTTPS reverse proxy:

```text
Internet
   |
   v
HTTPS reverse proxy
   |
   +-- /       -> built public site
   +-- /api/*  -> Express API
   +-- /app*   -> tracker, when its application is added
```

This checkout does not contain the tracker UI, authentication service, PostgreSQL schema, or migrations. Do not enable `/app` as a production tracker route until those components are supplied and audited.

The same-origin pattern keeps authentication cookies and API requests on one domain, which is essential for secure session handling.

## Required environment variables

Copy `.env.example` to `.env` and set real values in a secret manager or protected deployment environment. Never commit `.env`.

Required for the contact API:

- `NODE_ENV=production`
- `PORT`
- `CONTACT_EMAIL`
- `FROM_EMAIL`
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_SECURE`

Operational values:

- `TRUST_PROXY=true` only when the app is behind the documented trusted reverse proxy
- `REDIS_URL` for shared rate limits across API instances
- `APP_URL` and `API_URL` for deployment metadata

`DATABASE_URL` and `SESSION_SECRET` are reserved in the template for the missing tracker integration and are not read by this public-site API.

```bash
cp .env.example .env
```

## Contact API

`POST /api/contact` validates all fields server-side, limits JSON to 1 MB, applies rate limiting, and sends plain-text email through configured SMTP. Without complete SMTP configuration the endpoint returns `503`; it never reports success.

## Redis and rate limiting

Redis is optional for one instance and required for consistent rate limits across multiple instances. When `REDIS_URL` is unavailable, the API logs a warning and uses process-local limits.

## Database and tracker status

No database, migrations, sessions, authentication, password management, audit log, or tracker authorization code exists in this checkout. A future tracker integration must add PostgreSQL migrations, parameterized queries, Argon2id password hashing, opaque secure sessions, authorization middleware, and tests before `/app` is enabled.

## Reverse proxy and HTTPS

Run the application behind a TLS-terminating reverse proxy such as Nginx, Caddy, or a managed cloud load balancer.

Use secure cookies and trust proxy only where the proxy is trusted.

## Build and run

```bash
npm ci
npm run import-team
npm run typecheck
npm run build
NODE_ENV=production PORT=4300 node server/index.mjs
```

The Node process should not be directly exposed to the public internet. Terminate HTTPS at the reverse proxy and forward only the required paths.


## Backups

PostgreSQL backups are not configured by this repository. Once a tracker database exists, schedule backups outside the application host, retain multiple recovery points, and test restores. A typical operator-run backup is:

```bash
pg_dump --format=custom --file=neuro-paradigm-$(date +%Y-%m-%d).dump "$DATABASE_URL"
pg_restore --clean --if-exists --dbname="$DATABASE_URL" neuro-paradigm-YYYY-MM-DD.dump
```

Use separate backup storage and follow the provider's retention and disaster-recovery policy. Do not claim backups are automated until that infrastructure is configured.


## Security checklist

- Use HTTPS and set `TRUST_PROXY=true` only behind a trusted proxy.
- Keep real environment values out of Git.
- Keep Redis shared when horizontally scaling the API.
- Confirm CSP, HSTS, same-origin routing, and frame protection at the proxy.
- Configure SMTP sender and recipient addresses explicitly.
- Test invalid input, delivery failure, and HTTP 429 responses before launch.
- Do not expose `/app` until the missing tracker security controls are implemented.

## Smoke test

- Homepage loads.
- Public pages render.
- Contact form returns 400 for invalid input.
- Contact form posts successfully only with valid data.
- API health endpoint responds at /api/health.
- `/app` is not enabled until the tracker integration is present.
