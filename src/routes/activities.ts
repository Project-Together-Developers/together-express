import { Router } from 'express';
import { validate } from '../middleware/validate';
import { createActivitySchema, updateActivitySchema } from '../schemas/activity-schemas';
import {
  createActivityHandler,
  getActivitiesHandler,
  getActivityHandler,
  updateActivityHandler,
  deleteActivityHandler,
} from '../controllers/activities';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, requireRole('admin'), validate(createActivitySchema), createActivityHandler);
router.get('/', getActivitiesHandler);
router.get('/:id', getActivityHandler);
router.patch('/:id', authenticate, requireRole('admin'), validate(updateActivitySchema), updateActivityHandler);
router.delete('/:id', authenticate, requireRole('admin'), deleteActivityHandler);

export default router;
