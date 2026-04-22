import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { User } from '../models/user';
import { AppError } from '../middleware/errorHandler';
import { ErrorMessage, SuccessMessage } from '../enums/error-codes';
import { sendSuccess } from '../utils/response';
import { uploadAvatar } from '../config/r2';
import { CheckUsernameQuery, CompleteProfileBody } from '../schemas/user-schemas';
import { IUser } from '../models/user';

function serializeUser(user: IUser) {
  return {
    id: user.id as string,
    phone: user.phone,
    name: user.name,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    gender: user.gender,
    birthday: user.birthday ? user.birthday.toISOString() : undefined,
    avatar: user.avatar,
    isProfileComplete: user.isProfileComplete,
    role: 'user' as const,
  };
}

export async function checkUsernameHandler(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { username } = req.query as unknown as CheckUsernameQuery;
    const existing = await User.findOne({ username });
    sendSuccess(_res, { available: !existing });
  } catch (err) {
    next(err);
  }
}

export async function completeProfileHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const body = req.body as CompleteProfileBody;
    const file = req.file;

    const user = await User.findById(req.user.userId);
    if (!user) throw new AppError(404, ErrorMessage.USER_NOT_FOUND);
    if (user.isProfileComplete) throw new AppError(400, ErrorMessage.PROFILE_ALREADY_COMPLETE);

    const takenBy = await User.findOne({ username: body.username });
    if (takenBy && takenBy.id !== user.id) {
      throw new AppError(409, ErrorMessage.USERNAME_TAKEN);
    }

    let avatarUrl: string | undefined;
    if (file) {
      avatarUrl = await uploadAvatar(file.buffer, file.mimetype, user.id);
    }

    user.username = body.username;
    user.firstname = body.firstname;
    user.lastname = body.lastname;
    user.gender = body.gender;
    user.birthday = body.birthday;
    if (avatarUrl) user.avatar = avatarUrl;
    user.name = body.lastname ? `${body.firstname} ${body.lastname}` : body.firstname;
    user.isProfileComplete = true;
    await user.save();

    sendSuccess(res, { user: serializeUser(user) }, 200, SuccessMessage.PROFILE_COMPLETED);
  } catch (err) {
    next(err);
  }
}
