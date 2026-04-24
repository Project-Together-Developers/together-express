import { Router } from 'express';
import { validate } from '../middleware/validate';
import { createEventSchema, updateEventSchema, updateEventStatusSchema, getAdminEventsQuerySchema } from '../schemas/event-schemas';
import {
  createEventHandler,
  getEventsHandler,
  getMyEventsHandler,
  getEventHandler,
  getAdminEventsHandler,
  updateEventHandler,
  deleteEventHandler,
  updateEventStatusHandler,
  joinEventHandler,
  leaveEventHandler,
} from '../controllers/events';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, validate(createEventSchema), createEventHandler);
router.get('/admin', authenticate, requireRole('admin'), validate(getAdminEventsQuerySchema, 'query'), getAdminEventsHandler);
router.get('/my', authenticate, getMyEventsHandler);
router.get('/', getEventsHandler);
router.get('/:id', getEventHandler);
router.patch('/:id', authenticate, validate(updateEventSchema), updateEventHandler);
router.delete('/:id', authenticate, deleteEventHandler);
router.patch('/:id/status', authenticate, requireRole('admin'), validate(updateEventStatusSchema), updateEventStatusHandler);
router.post('/:id/join', authenticate, joinEventHandler);
router.delete('/:id/join', authenticate, leaveEventHandler);

export default router;
