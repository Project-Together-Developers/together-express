import { Request, Response, NextFunction } from 'express';
import { Event } from '../models/event';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middleware/errorHandler';
import { ErrorMessage } from '../enums/error-codes';
import { CreateEventBody, UpdateEventBody, UpdateEventStatusBody } from '../schemas/event-schemas';

export async function createEventHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as CreateEventBody;
    const event = await Event.create(body);
    sendSuccess(res, event, 201);
  } catch (err) {
    next(err);
  }
}

export async function getEventsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const events = await Event.find({ status: 'approved' }).populate('activity');
    sendSuccess(res, events);
  } catch (err) {
    next(err);
  }
}

export async function getEventHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const event = await Event.findById(req.params.id).populate('activity');
    if (!event) return next(new AppError(404, ErrorMessage.EVENT_NOT_FOUND));
    sendSuccess(res, event);
  } catch (err) {
    next(err);
  }
}

export async function updateEventHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as UpdateEventBody;
    const event = await Event.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true }).populate('activity');
    if (!event) return next(new AppError(404, ErrorMessage.EVENT_NOT_FOUND));
    sendSuccess(res, event);
  } catch (err) {
    next(err);
  }
}

export async function deleteEventHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return next(new AppError(404, ErrorMessage.EVENT_NOT_FOUND));
    sendSuccess(res, null);
  } catch (err) {
    next(err);
  }
}

export async function updateEventStatusHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body as UpdateEventStatusBody;
    const event = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('activity');
    if (!event) return next(new AppError(404, ErrorMessage.EVENT_NOT_FOUND));
    sendSuccess(res, event);
  } catch (err) {
    next(err);
  }
}
