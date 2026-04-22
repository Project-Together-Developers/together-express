import { z } from 'zod';
import { ErrorMessage } from '../enums/error-codes';

const MIN_AGE_YEARS = 13;

const ddmmyyyyRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

function parseDDMMYYYY(input: string): Date | null {
  const match = input.match(ddmmyyyyRegex);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  if (date.getTime() > Date.now()) return null;
  return date;
}

function yearsBetween(from: Date, to: Date): number {
  let years = to.getUTCFullYear() - from.getUTCFullYear();
  const monthDiff = to.getUTCMonth() - from.getUTCMonth();
  const dayDiff = to.getUTCDate() - from.getUTCDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) years -= 1;
  return years;
}

export const usernameSchema = z
  .string({ error: ErrorMessage.USERNAME_REQUIRED })
  .trim()
  .toLowerCase()
  .min(3, ErrorMessage.USERNAME_INVALID)
  .max(20, ErrorMessage.USERNAME_INVALID)
  .regex(/^[a-z0-9_.]+$/, ErrorMessage.USERNAME_INVALID);

export const checkUsernameSchema = z.object({
  username: usernameSchema,
});

export const completeProfileSchema = z.object({
  username: usernameSchema,
  firstname: z
    .string({ error: ErrorMessage.FIRSTNAME_REQUIRED })
    .trim()
    .min(1, ErrorMessage.FIRSTNAME_REQUIRED)
    .max(50, ErrorMessage.FIRSTNAME_TOO_LONG),
  lastname: z
    .string()
    .trim()
    .min(1)
    .max(50, ErrorMessage.LASTNAME_TOO_LONG)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  gender: z
    .enum(['male', 'female'], { error: ErrorMessage.INVALID_GENDER })
    .optional()
    .or(z.literal('').transform(() => undefined)),
  birthday: z
    .string()
    .optional()
    .or(z.literal('').transform(() => undefined))
    .transform((val, ctx) => {
      if (!val) return undefined;
      const parsed = parseDDMMYYYY(val);
      if (!parsed) {
        ctx.addIssue({ code: 'custom', message: ErrorMessage.INVALID_BIRTHDAY });
        return z.NEVER;
      }
      if (yearsBetween(parsed, new Date()) < MIN_AGE_YEARS) {
        ctx.addIssue({ code: 'custom', message: ErrorMessage.UNDERAGE });
        return z.NEVER;
      }
      return parsed;
    }),
});

export type CheckUsernameQuery = z.infer<typeof checkUsernameSchema>;
export type CompleteProfileBody = z.infer<typeof completeProfileSchema>;
