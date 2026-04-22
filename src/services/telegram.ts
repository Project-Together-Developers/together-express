import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';
import { ErrorMessage } from '../enums/error-codes';

interface TgResponse<T> {
  ok: boolean;
  error?: string;
  result?: T;
}

interface SendVerificationResult {
  request_id: string;
}

interface CheckVerificationResult {
  verification_status?: {
    status: string;
  };
}

async function tgRequest<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`https://gatewayapi.telegram.org${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.telegram.gatewayToken}`,
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as TgResponse<T>;
  if (!data.ok) throw new AppError(502, data.error ?? ErrorMessage.TELEGRAM_GATEWAY_ERROR);
  return data.result as T;
}

export async function sendOtp(phone: string): Promise<string> {
  const result = await tgRequest<SendVerificationResult>('/sendVerificationMessage', {
    phone_number: phone,
    ttl: 300,
    code_length: 6,
  });
  return result.request_id;
}

export async function verifyOtp(requestId: string, code: string): Promise<boolean> {
  const result = await tgRequest<CheckVerificationResult>('/checkVerificationStatus', {
    request_id: requestId,
    code,
  });
  return result.verification_status?.status === 'code_valid';
}
