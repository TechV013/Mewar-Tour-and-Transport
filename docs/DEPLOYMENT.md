# Deployment guide

This project is a Next.js 15 App Router app with Prisma. Deployment needs a
Node.js 20.9+ runtime, an environment file, and a Postgres database for any
enquiries you intend to keep.

## Pre-flight checklist

Run locally before deploying:

```bash
npm ci
npm run check:env
npx tsc --noEmit
npm run lint
npm test
```

`npm run check:env` reads `.env` and `.env.local` and reports invalid values and
production warnings. It exits non-zero only for invalid values; warnings are
intentional because business contact details and optional integrations are
empty by design.

## Environment variables

Copy `.env.example` to `.env.local`. Set real values in the hosting provider,
not in the repository.

| Variable | Required in production | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes | `postgresql://` connection string. Without it enquiries use `.data/enquiries.json`, which is not durable on serverless hosts. |
| `ADMIN_TOKEN` | Yes for `/admin` | Long random password (32+ characters). Rotating it invalidates the password, not existing sessions. |
| `ADMIN_SESSION_SECRET` | No | Derived from `ADMIN_TOKEN` when empty. Set it explicitly to invalidate all sessions by rotating only the secret. |
| `ADMIN_COOKIE_SECURE` | No | Defaults to `true` in production. Only set `false` for local HTTP testing. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Full origin such as `https://example.com`. Used for canonical URLs, sitemap and robots. |
| `ENQUIRY_WEBHOOK_URL` | No | HTTPS endpoint notified after each stored enquiry. |
| `ENQUIRY_WEBHOOK_SECRET` | Recommended with webhook | Receivers verify `x-mtt-signature`. |
| `ENQUIRY_DATA_FILE` | No | Overrides the JSON fallback path. Use only for local development. |
| `NEXT_PUBLIC_HERO_IMAGE` | No | Root-relative path or absolute image URL. Empty uses the branded SVG fallback. |
| `NEXT_PUBLIC_BUSINESS_*` | No | Owner-verified contact details. Empty values are hidden in the UI by design. |
| `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_FACEBOOK_URL`, `NEXT_PUBLIC_LINKEDIN_URL` | No | Social links; empty values are hidden. |

`NEXT_PUBLIC_*` values are compiled into the client bundle, so changing them
requires a rebuild. Server-only values are read at process start.

## Vercel + Neon

1. Create a Neon Postgres database and copy its pooled connection string.
2. Import the repository into Vercel. Framework preset: Next.js.
3. Add every variable from the table above under **Project Settings → Environment Variables**.
4. Install the Vercel CLI and push the Prisma schema once against the database:

   ```bash
   vercel env pull .env.local
   npm run db:push
   ```

5. Deploy. The build command is `next build`; `postinstall` generates the Prisma client.
6. Open `/api/health` on the deployment. It must return `200` and `"status": "ok"`.

## Self-hosted Node

```bash
npm ci
npm run db:push        # with DATABASE_URL set
npm run build
npm run start          # or run behind a reverse proxy that terminates TLS
```

Ensure the process can write to the working directory only if you are using the
JSON fallback. With Postgres configured no local write access is needed.

## Health and monitoring

`GET /api/health` returns:

```json
{
  "status": "ok",
  "checkedAt": "...",
  "store": "ok",
  "config": {
    "nodeEnv": "production",
    "admin": true,
    "database": true,
    "fileFallback": false,
    "webhook": true,
    "webhookSigned": true,
    "siteUrl": "https://example.com"
  },
  "errors": [],
  "warnings": []
}
```

A `503` means configuration is invalid or the enquiry store is unreachable.
Point an uptime monitor at this endpoint. The response never includes secret
values, customer data or webhook payloads.

Server errors are written to stdout/stderr as one JSON object per line with
`level`, `scope`, `at`, `error` and an allowlisted `context` object. Ingest these
lines in your log platform and alert on `level:"error"`. In development the
message is included as `developmentMessage`; it is omitted in production.

`POST /api/enquiries` echoes an `x-request-id` header. Pass it to support when
tracing a failed enquiry; the same id appears in server logs.

Admin pages include an error boundary with a reset action. Public pages and the
admin shell each have localized/generic fallbacks so a single broken component
does not blank the whole site.

## Webhook receiver contract

- Header `x-mtt-signature: sha256=<hex>` is `HMAC-SHA256(rawBody, ENQUIRY_WEBHOOK_SECRET)`.
- Verify with a constant-time comparison before trusting the payload.
- Delivery is best-effort, with a five-second timeout. A failing receiver never
  rolls back an enquiry; monitor the `enquiry.webhook` warning logs.

## Post-deploy smoke test

1. `GET /api/health` → `200`, `status: "ok"`.
2. `GET /robots.txt` → disallows `/api/` and `/admin/`.
3. `GET /sitemap.xml` → URLs use the production origin.
4. Submit a test enquiry from `/en/taxi-services`; confirm a `MTT-XXXXXX` reference.
5. Confirm the enquiry appears in `/admin` and in Neon.
6. Sign in to `/admin`, update status and add a payment link; verify it persists.
7. Check `/hi` pages for translated headings and no raw `pages.*` keys.
8. Check browser console for errors and both locales for horizontal overflow.

## Rollback

Redeploy the previous known-good build. Schema changes are additive so far;
 do not delete `Enquiry` or `EnquiryEvent` data when rolling back. Keep
 `ADMIN_SESSION_SECRET` stable unless you intend to sign everyone out.
