import { Request, Response, NextFunction } from 'express';
import { Activity } from '../models/activity';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middleware/errorHandler';
import { ErrorMessage } from '../enums/error-codes';
import { CreateActivityBody, UpdateActivityBody } from '../schemas/activity-schemas';

export async function createActivityHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as CreateActivityBody;
    const activity = await Activity.create(body);
    sendSuccess(res, activity, 201);
  } catch (err) {
    next(err);
  }
}

export async function getActivitiesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const activities = await Activity.find({ isActive: true });
    sendSuccess(res, activities);
  } catch (err) {
    next(err);
  }
}

export async function getActivityHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return next(new AppError(404, ErrorMessage.ACTIVITY_NOT_FOUND));
    sendSuccess(res, activity);
  } catch (err) {
    next(err);
  }
}

export async function updateActivityHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as UpdateActivityBody;
    const activity = await Activity.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!activity) return next(new AppError(404, ErrorMessage.ACTIVITY_NOT_FOUND));
    sendSuccess(res, activity);
  } catch (err) {
    next(err);
  }
}

export async function deleteActivityHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return next(new AppError(404, ErrorMessage.ACTIVITY_NOT_FOUND));
    sendSuccess(res, null);
  } catch (err) {
    next(err);
  }
}
