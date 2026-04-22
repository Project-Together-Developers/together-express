import { z } from 'zod';
import { ErrorMessage } from '../enums/error-codes';

const phoneSchema = z
  .string({ error: ErrorMessage.PHONE_REQUIRED })
  .regex(/^\+\d{7,15}$/, ErrorMessage.INVALID_PHONE_FORMAT);

export const sendOtpSchema = z.object({
  phone: phoneSchema,
});

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  code: z
    .string({ error: ErrorMessage.PHONE_AND_CODE_REQUIRED })
    .length(6, ErrorMessage.INVALID_OTP_FORMAT)
    .regex(/^\d{6}$/, ErrorMessage.INVALID_OTP_FORMAT),
});

export const refreshSchema = z.object({
  refreshToken: z
    .string({ error: ErrorMessage.REFRESH_TOKEN_REQUIRED })
    .min(1, ErrorMessage.REFRESH_TOKEN_REQUIRED),
});

export const logoutSchema = z.object({
  refreshToken: z.string().optional(),
});

export const adminLoginSchema = z.object({
  email: z
    .string({ error: ErrorMessage.EMAIL_REQUIRED })
    .email(ErrorMessage.INVALID_EMAIL),
  password: z
    .string({ error: ErrorMessage.PASSWORD_REQUIRED })
    .min(1, ErrorMessage.PASSWORD_REQUIRED),
});

export type SendOtpBody = z.infer<typeof sendOtpSchema>;
export type VerifyOtpBody = z.infer<typeof verifyOtpSchema>;
export type RefreshBody = z.infer<typeof refreshSchema>;
export type LogoutBody = z.infer<typeof logoutSchema>;
export type AdminLoginBody = z.infer<typeof adminLoginSchema>;
