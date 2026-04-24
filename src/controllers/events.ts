import { Response, NextFunction } from 'express';
import { Event } from '../models/event';
import { EventParticipant } from '../models/event-participant';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middleware/errorHandler';
import { ErrorMessage } from '../enums/error-codes';
import { CreateEventBody, UpdateEventBody, UpdateEventStatusBody, GetAdminEventsQuery } from '../schemas/event-schemas';
import { AuthRequest } from '../types';

export async function createEventHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { activityId, ...rest } = req.body as CreateEventBody;
    const userId = req.user!.userId;
    const event = await Event.create({ ...rest, activity: activityId, organizer: userId });
    sendSuccess(res, event, 201);
  } catch (err) {
    next(err);
  }
}

export async function getEventsHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const events = await Event.find({ status: 'approved' })
      .populate('activity')
      .populate('organizer', 'firstname lastname username avatar')
      .sort({ dateFrom: 1 });
    sendSuccess(res, events);
  } catch (err) {
    next(err);
  }
}

export async function getMyEventsHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const participantEntries = await EventParticipant.find({ user: userId }).select('event');
    const participantEventIds = participantEntries.map((p) => p.event);

    const events = await Event.find({
      status: 'approved',
      $or: [{ organizer: userId }, { _id: { $in: participantEventIds } }],
    })
      .populate('activity')
      .populate('organizer', 'firstname lastname username avatar')
      .sort({ dateFrom: 1 });

    sendSuccess(res, events);
  } catch (err) {
    next(err);
  }
}

export async function getEventHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const event = await Event.findById(req.params.id)
      .populate('activity')
      .populate('organizer', 'firstname lastname username avatar');
    if (!event) return next(new AppError(404, ErrorMessage.EVENT_NOT_FOUND));

    const participants = await EventParticipant.find({ event: event._id })
      .populate('user', 'firstname lastname username avatar')
      .sort({ joinedAt: 1 });

    sendSuccess(res, { ...event.toObject(), participants });
  } catch (err) {
    next(err);
  }
}

export async function updateEventHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const body = req.body as UpdateEventBody;
    const event = await Event.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true }).populate('activity');
    if (!event) return next(new AppError(404, ErrorMessage.EVENT_NOT_FOUND));
    sendSuccess(res, event);
  } catch (err) {
    next(err);
  }
}

export async function deleteEventHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return next(new AppError(404, ErrorMessage.EVENT_NOT_FOUND));
    await EventParticipant.deleteMany({ event: req.params.id });
    sendSuccess(res, null);
  } catch (err) {
    next(err);
  }
}

export async function getAdminEventsHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status } = req.query as GetAdminEventsQuery;
    const filter = status ? { status } : {};
    const events = await Event.find(filter)
      .populate('activity')
      .populate('organizer', 'firstname lastname username avatar')
      .sort({ createdAt: -1 });
    sendSuccess(res, events);
  } catch (err) {
    next(err);
  }
}

export async function updateEventStatusHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status } = req.body as UpdateEventStatusBody;
    const event = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('activity');
    if (!event) return next(new AppError(404, ErrorMessage.EVENT_NOT_FOUND));
    sendSuccess(res, event);
  } catch (err) {
    next(err);
  }
}

export async function joinEventHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const event = await Event.findById(req.params.id);
    if (!event) return next(new AppError(404, ErrorMessage.EVENT_NOT_FOUND));

    const totalOccupied = event.spotsFilled + event.alreadyGoing;
    if (totalOccupied >= event.spots) return next(new AppError(400, ErrorMessage.EVENT_FULL));

    const existing = await EventParticipant.findOne({ event: event._id, user: userId });
    if (existing) return next(new AppError(400, ErrorMessage.ALREADY_JOINED));

    await EventParticipant.create({ event: event._id, user: userId });
    event.spotsFilled += 1;
    await event.save();

    sendSuccess(res, { joined: true, spotsFilled: event.spotsFilled });
  } catch (err) {
    next(err);
  }
}

export async function leaveEventHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const event = await Event.findById(req.params.id);
    if (!event) return next(new AppError(404, ErrorMessage.EVENT_NOT_FOUND));

    const participant = await EventParticipant.findOneAndDelete({ event: event._id, user: userId });
    if (!participant) return next(new AppError(400, ErrorMessage.NOT_JOINED));

    event.spotsFilled = Math.max(0, event.spotsFilled - 1);
    await event.save();

    sendSuccess(res, { joined: false, spotsFilled: event.spotsFilled });
  } catch (err) {
    next(err);
  }
}
