import { Router } from 'express';
import { healthCheck } from '../controllers/health';

const router: Router = Router();
router.get('/', healthCheck);

export default router;
