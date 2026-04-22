# Together Backend

Express.js + TypeScript REST API for the Together outdoor activity app.

## Tech Stack

- **Runtime**: Node.js v20 + Express.js + TypeScript
- **Database**: MongoDB (Mongoose)
- **Cache**: Redis (ioredis)
- **Storage**: Cloudflare R2 (S3-compatible, aws-sdk v3)
- **Realtime**: Socket.io
- **Auth**: JWT (access + refresh tokens)
- **OTP**: Telegram Gateway

## Setup

```bash
# Install dependencies
pnpm install

# Copy env file and fill in values
cp .env.example .env

# Start dev server
pnpm dev
```

## Folder Structure

```
src/
├── config/       # DB, Redis, R2, env
├── controllers/  # Route handlers
├── middleware/   # Auth, i18n, error handler
├── models/       # Mongoose models
├── routes/       # Express routers
├── services/     # Business logic
├── types/        # TypeScript types
└── utils/        # JWT helpers, response utils
```

## API

- `GET /api/v1/health` — Health check (MongoDB + Redis status)

## Environment Variables

See `.env.example` for all required variables.
