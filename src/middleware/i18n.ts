import { Request, Response, NextFunction } from 'express';
import { SupportedLocale } from '../types';

const SUPPORTED: SupportedLocale[] = ['ru', 'uz', 'en'];
const DEFAULT_LOCALE: SupportedLocale = 'ru';

function parseLocale(header: string | undefined): SupportedLocale {
  if (!header) return DEFAULT_LOCALE;
  const tags = header.split(',').map((s) => s.split(';')[0].trim().toLowerCase().slice(0, 2));
  for (const tag of tags) {
    if (SUPPORTED.includes(tag as SupportedLocale)) return tag as SupportedLocale;
  }
  return DEFAULT_LOCALE;
}

export function i18nMiddleware(req: Request, _res: Response, next: NextFunction): void {
  (req as Request & { locale: SupportedLocale }).locale = parseLocale(
    req.headers['accept-language'],
  );
  next();
}
