## Key layers

| Layer | Location | Purpose |
|---|---|---|
| Config | `src/config/` | `env.ts` validates all env vars at startup; `db.ts` MongoDB; `redis.ts` ioredis; `r2.ts` Cloudflare R2 uploads |
| Routes | `src/routes/` | `index.ts` mounts sub-routers; each route file applies `validate()` middleware before its controller |
| Controllers | `src/controllers/` | Thin; call services/models, use `sendSuccess()` / throw `AppError` |
| Middleware | `src/middleware/` | `auth.ts` JWT bearer; `validate.ts` Zod wrapper; `upload.ts` multer memory-storage; `i18n.ts` locale from `Accept-Language` |
| Models | `src/models/` | Mongoose — `User` (phone-auth, geolocation `2dsphere` index) and `Admin` (email+bcrypt) |
| Schemas | `src/schemas/` | Zod schemas define request shapes and export inferred types used in controllers |
| Enums | `src/enums/error-codes.ts` | All `ErrorMessage` and `SuccessMessage` string constants |
| Utils | `src/utils/` | `jwt.ts` sign/verify access+refresh tokens; `response.ts` `sendSuccess()`/`sendError()` helpers |
| Services | `src/services/telegram.ts` | Telegram Gateway API for OTP (send + verify) |
