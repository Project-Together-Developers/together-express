import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { avatarUpload } from '../middleware/upload';
import { checkUsernameHandler, completeProfileHandler } from '../controllers/users';
import { checkUsernameSchema, completeProfileSchema } from '../schemas/user-schemas';

const router: Router = Router();

router.get('/check-username', validate(checkUsernameSchema, 'query'), checkUsernameHandler);
router.post(
  '/me/complete-profile',
  authenticate,
  avatarUpload.single('avatar'),
  validate(completeProfileSchema),
  completeProfileHandler,
);

export default router;
