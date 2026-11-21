# MEWAR TOUR AND TRANSPORT

Bilingual, quotation-first booking site built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui and next-intl.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional for public pages; required for admin
npm run dev
```

- Public site: `http://localhost:3000/en` and `http://localhost:3000/hi`
- Admin: `http://localhost:3000/admin/login`

Copy `.env.example` to `.env.local` and fill in the values you need. Never commit real credentials.

Vercel-ready: `vercel.json`, Node 22 (`.nvmrc` / `engines`) and a GitHub Actions CI workflow are included. Import the repo into Vercel, set the environment variables, run `npm run db:push` once against Neon, and push. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm test` | Build, then run the automated regression suite |
| `npm run check:env` | Validate `.env`/`.env.local` and report production warnings |
| `npx tsc --noEmit` | TypeScript check |
| `npm run db:generate` | Generate Prisma client from `prisma/schema.prisma` |
| `npm run db:push` | Push the schema to the configured database |
| `npm run db:studio` | Browse enquiries in Prisma Studio |

## Enquiry flow

1. A visitor submits the booking widget or contact form.
2. `POST /api/enquiries` validates the payload, stores it, and returns a reference such as `MTT-AB12CD`.
3. No payment, availability or price is shown publicly. The team reviews the enquiry and replies with a quotation.
4. Staff manage enquiries in `/admin`, including status (`NEW`, `QUOTED`, `CONFIRMED`, `CANCELLED`), quoted amount and internal notes.
5. After sending a quotation, staff can record a payment link created in an external tool: a `https://` URL, an external payment reference and an internal note. The link is admin-only; there is no provider integration, public price display or payment status webhook.

### Persistence

- With `DATABASE_URL` set (Neon/Postgres), enquiries are stored with Prisma. Run `npm run db:push` once against a new database.
- Without `DATABASE_URL`, enquiries are written to `.data/enquiries.json`. This is a local development fallback only; serverless filesystems are ephemeral.
- `ENQUIRY_DATA_FILE` overrides the fallback path.
- The public API is rate-limited in-process and revalidates all input, including a maximum payload size.

### Admin access

Set `ADMIN_TOKEN` to a long random value and sign in at `/admin/login`. The token is compared in constant time and exchanged for an httpOnly, signed cookie that expires after eight hours. `ADMIN_SESSION_SECRET` is optional; when omitted it is derived from `ADMIN_TOKEN`. Set it explicitly if you want to invalidate all sessions by rotating only the session secret. Cookies are `Secure` in production; only set `ADMIN_COOKIE_SECURE=false` for local production-mode testing over plain HTTP.

Admin pages send `noindex` and are excluded from the locale middleware.

### Webhook hook

Set `ENQUIRY_WEBHOOK_URL` to receive a `POST` for every stored enquiry. Set `ENQUIRY_WEBHOOK_SECRET` to enable signature verification.

Headers:

- `content-type: application/json`
- `x-mtt-signature: sha256=<hex HMAC-SHA256 of the raw request body using ENQUIRY_WEBHOOK_SECRET>`

Payload:

```json
{
  "type": "enquiry.created",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "data": {
    "reference": "MTT-AB12CD",
    "service": "taxi",
    "name": "...",
    "phone": "...",
    "email": null,
    "details": {},
    "status": "NEW",
    "enquiryCreatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

Delivery is best-effort with a five-second timeout. A failing webhook never blocks or rolls back an enquiry. Verify the signature and use HTTPS; do not log the raw payload.

### Regression tests

`npm test` builds the app, starts a temporary production server on port 3100 and
an in-process webhook receiver, then runs `node --test`. It checks env
validation, health, enquiry persistence, signed webhook delivery, rate limiting,
admin protection and login, runtime sitemap/robots URLs, and EN/HI rendering. Test
data is written to a temporary file outside the repo and removed afterwards.
Set `MTT_TEST_PORT` to use a different port if 3100 is occupied.

### Health, logging and deployment

`GET /api/health` checks configuration and the enquiry store, returns `200` when healthy and `503` otherwise, and never exposes secret values. Enquiry responses include an `x-request-id` header that is also written to structured server logs. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the environment checklist, Vercel/Neon setup, monitoring contract and post-deploy smoke test.

## Content principles

- No invented prices, availability, fleet model names, customer reviews or business contact details.
- Business contact details come from `NEXT_PUBLIC_BUSINESS_*` environment variables.
- Fleet capacity figures are illustrative and labelled as such.
- About and legal pages remain placeholders until verified content is supplied.
- The hero uses a branded SVG fallback; set `NEXT_PUBLIC_HERO_IMAGE` to use real photography.
