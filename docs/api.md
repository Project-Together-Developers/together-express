# API Conventions

Express + TypeScript REST API with Socket.io. All routes are versioned under `/v1`.

**Bootstrap flow**: `server.ts` connects MongoDB and Redis, creates the HTTP server, attaches Socket.io, then starts listening. Express app config lives in `app.ts`.

**Request lifecycle**: `helmet` → `cors` → `morgan` → `express.json` → `i18nMiddleware` → route handler → `errorHandler`.

## Error handling

Throw `AppError(statusCode, message)` from anywhere in the request chain. The global `errorHandler` in `src/middleware/errorHandler.ts` catches it. 5xx errors are also logged via Winston.

## File uploads

`avatarUpload` (multer, memory storage, 5 MB limit, image-only filter) → controller reads `req.file.buffer` and calls `uploadAvatar()` in `src/config/r2.ts`, which pushes to Cloudflare R2 and returns a public URL.
