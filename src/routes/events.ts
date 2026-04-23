import { Router } from 'express';
import { validate } from '../middleware/validate';
import { createEventSchema, updateEventSchema, updateEventStatusSchema } from '../schemas/event-schemas';
import {
  createEventHandler,
  getEventsHandler,
  getEventHandler,
  updateEventHandler,
  deleteEventHandler,
  updateEventStatusHandler,
} from '../controllers/events';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, validate(createEventSchema), createEventHandler);
router.get('/', getEventsHandler);
router.get('/:id', getEventHandler);
router.patch('/:id', authenticate, validate(updateEventSchema), updateEventHandler);
router.delete('/:id', authenticate, deleteEventHandler);
router.patch('/:id/status', authenticate, requireRole('admin'), validate(updateEventStatusSchema), updateEventStatusHandler);

export default router;
