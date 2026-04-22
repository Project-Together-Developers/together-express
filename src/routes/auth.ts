import { Router } from 'express';
import { sendOtpHandler, verifyOtpHandler, refreshHandler, logoutHandler } from '../controllers/auth';
import { adminLoginHandler } from '../controllers/admin-auth';
import { validate } from '../middleware/validate';
import {
  sendOtpSchema,
  verifyOtpSchema,
  refreshSchema,
  logoutSchema,
  adminLoginSchema,
} from '../schemas/auth-schemas';

const router: Router = Router();

router.post('/send-otp', validate(sendOtpSchema), sendOtpHandler);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtpHandler);
router.post('/refresh', validate(refreshSchema), refreshHandler);
router.post('/logout', validate(logoutSchema), logoutHandler);
router.post('/admin/login', validate(adminLoginSchema), adminLoginHandler);

export default router;
