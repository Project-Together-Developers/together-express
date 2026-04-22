import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { redis } from '../config/redis';
import { env } from '../config/env';
import { User } from '../models/user';
import { sendOtp, verifyOtp } from '../services/telegram';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middleware/errorHandler';
import { ErrorMessage, SuccessMessage } from '../enums/error-codes';
import { SendOtpBody, VerifyOtpBody, RefreshBody, LogoutBody } from '../schemas/auth-schemas';

const OTP_TTL = 300;
const REFRESH_TTL = 30 * 24 * 60 * 60;
const DEV_OTP = '123456';

export async function sendOtpHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone } = req.body as SendOtpBody;

    if (env.isDev) {
      await redis.setex(`otp:${phone}`, OTP_TTL, DEV_OTP);
    } else {
      const requestId = await sendOtp(phone);
      await redis.setex(`otp:${phone}`, OTP_TTL, requestId);
    }

    sendSuccess(res, { phone }, 200, SuccessMessage.OTP_SENT);
  } catch (err) {
    next(err);
  }
}

export async function verifyOtpHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone, code } = req.body as VerifyOtpBody;

    const stored = await redis.get(`otp:${phone}`);
    if (!stored) throw new AppError(400, ErrorMessage.OTP_EXPIRED);

    const isValid = env.isDev ? code === DEV_OTP : await verifyOtp(stored, code);
    if (!isValid) throw new AppError(400, ErrorMessage.INVALID_OTP);

    await redis.del(`otp:${phone}`);

    let user = await User.findOne({ phone });
    if (!user) {
      const countryCode = phone.slice(0, phone.length - 9) || '+998';
      user = await User.create({ phone, countryCode });
    }

    if (user.isBanned) throw new AppError(403, ErrorMessage.ACCOUNT_BANNED);

    const tokenId = crypto.randomUUID();
    const payload = { userId: user.id as string, phone: user.phone, role: 'user' as const };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ ...payload, tokenId });

    await redis.setex(`refresh:${user.id}:${tokenId}`, REFRESH_TTL, refreshToken);

    sendSuccess(
      res,
      {
        accessToken,
        refreshToken,
        user: { id: user.id, phone: user.phone, name: user.name, avatar: user.avatar, role: 'user' },
      },
      200,
      SuccessMessage.AUTH_SUCCESS,
    );
  } catch (err) {
    next(err);
  }
}

export async function refreshHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body as RefreshBody;

    let payload: ReturnType<typeof verifyRefreshToken>;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError(401, ErrorMessage.INVALID_REFRESH_TOKEN);
    }

    const stored = await redis.get(`refresh:${payload.userId}:${payload.tokenId}`);
    if (!stored || stored !== refreshToken) throw new AppError(401, ErrorMessage.REFRESH_TOKEN_REVOKED);

    await redis.del(`refresh:${payload.userId}:${payload.tokenId}`);

    const newTokenId = crypto.randomUUID();
    const newPayload = { userId: payload.userId, phone: payload.phone, role: payload.role };
    const newAccessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken({ ...newPayload, tokenId: newTokenId });

    await redis.setex(`refresh:${payload.userId}:${newTokenId}`, REFRESH_TTL, newRefreshToken);

    sendSuccess(res, { accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
}

export async function logoutHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body as LogoutBody;
    if (refreshToken) {
      try {
        const payload = verifyRefreshToken(refreshToken);
        await redis.del(`refresh:${payload.userId}:${payload.tokenId}`);
      } catch {
        return next();
      }
    }
    sendSuccess(res, null, 200, SuccessMessage.LOGGED_OUT);
  } catch (err) {
    next(err);
  }
}
