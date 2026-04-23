# Project Rules
- **Naming:** `kebab-case` for files. Use descriptive variables.
- **Types:** No `any`. Use Mongoose interfaces & `z.infer`.
- **ENV Vars:** Access strictly via `src/config/env.ts`, never `process.env`.
- **Controllers:** Keep thin. Respond via `sendSuccess(res, data, status, msg)` (`src/utils/response.ts`).
- **Errors:** Throw `AppError(status, ErrorMessage.ENUM)`. Wrap async in `try-catch(next)`. No hardcoded strings.
- **Validation:** Use `zod` (`src/schemas/`). Apply `validate(schema)` middleware in routes.
- **DB/Cache:** MongoDB (persistent), Redis (ephemeral/TTL data).
- **Auth:** Telegram OTP -> JWT Access + Refresh. Refresh tokens stored in Redis (`refresh:<id>:<token>`).
- **i18n:** `req.locale` set by `i18nMiddleware`. Use locale-aware responses.
