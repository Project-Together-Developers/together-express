# API Conventions
- **Stack:** Express, TypeScript, Socket.io. Routes under `/v1`.
- **Bootstrap:** `server.ts` (MongoDB, Redis, HTTP, Socket). `app.ts` (Express config).
- **Lifecycle:** `helmet` → `cors` → `morgan` → `express.json` → `i18n` → `route` → `errorHandler`.
- **Errors:** Throw `AppError(status, msg)`. Caught globally. 5xx logged via Winston.
- **Uploads:** `avatarUpload` (multer, 5MB memory) → `uploadAvatar()` pushes to Cloudflare R2, returns URL.
