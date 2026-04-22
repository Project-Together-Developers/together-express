import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { ErrorMessage } from '../enums/error-codes';

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

const imageFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error(ErrorMessage.AVATAR_INVALID_TYPE));
    return;
  }
  cb(null, true);
};

export const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_AVATAR_BYTES },
  fileFilter: imageFilter,
});
