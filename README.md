# AuroraMail (Temp Mail App)

AuroraMail is a production-ready temporary email web app with a modern gradient UI, session-persistent disposable addresses, realtime inbox updates, provider abstraction, and deploy-ready Docker support.

## Stack
- Next.js 14 (App Router) + TypeScript + TailwindCSS
- Next.js Route Handlers for API backend
- Prisma + PostgreSQL
- SSE realtime updates for inbox events
- Zod input validation, HTML sanitization, basic in-memory rate limiting

## Core Features Implemented
1. Instant random disposable email generation on home page.
2. Regenerate, copy, and domain-switch dropdown.
3. 50+ domains in `lib/domains.json`, seeded into DB, admin-manageable via DB or file.
4. Realtime inbox updates (SSE).
5. Message details with sanitized HTML + plaintext + attachments.
6. Session persistence (`localStorage`) for active address + favorite domains.
7. Search and filters (`unread`, `withAttachments`, `sender`).
8. Basic abuse prevention (IP key in-memory rate limiting).
9. Required API endpoints:
   - `POST /api/address`
   - `GET /api/domains`
   - `GET /api/inbox?address=...`
   - `GET /api/message/:id`
   - `DELETE /api/address`
10. Creative gradient theme, subtle animation, empty states, loading states.

## Provider Layer
- `lib/providers/types.ts` defines provider interface.
- `mock-provider.ts` for development seed messages.
- `mailgun-provider.ts` as a real provider example through webhook payload parsing.
- `/api/provider/inbound` ingests provider webhook messages.
- `/api/dev/mock-message` triggers mock incoming emails in development.

## Setup
```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `EMAIL_PROVIDER`: `mock` or `mailgun`
- `MAILGUN_API_KEY`: optional if integrating full Mailgun API usage
- `MAILGUN_SIGNING_KEY`: optional for webhook signature validation extension

## Database Migrations
Create migration:
```bash
npm run prisma:migrate -- --name init
```

## Add / Remove Domains
### Option A: JSON seed list
1. Edit `lib/domains.json`
2. Run `npm run prisma:seed`

### Option B: Admin DB updates
Update rows in `Domain` table and set `isActive` to toggle availability.

## Switch Email Provider
- Set `EMAIL_PROVIDER=mock` for dev simulation.
- Set `EMAIL_PROVIDER=mailgun` and post inbound payloads to `/api/provider/inbound`.

## Docker (Production)
```bash
docker compose up --build
```
App runs on `http://localhost:3000`.

## Testing
```bash
npm test
```
Includes unit tests for provider behavior and core API validation/rate-limiting behavior.
