export enum ErrorMessage {
  PHONE_REQUIRED = 'Phone number is required',
  INVALID_PHONE_FORMAT = 'Phone must be in international format (e.g. +998901234567)',
  PHONE_AND_CODE_REQUIRED = 'Phone and code are required',
  INVALID_OTP_FORMAT = 'Code must be exactly 6 digits',
  OTP_EXPIRED = 'OTP expired or not found. Please request a new code.',
  INVALID_OTP = 'Invalid verification code',
  ACCOUNT_BANNED = 'This account has been banned',
  REFRESH_TOKEN_REQUIRED = 'Refresh token is required',
  INVALID_REFRESH_TOKEN = 'Invalid or expired refresh token',
  REFRESH_TOKEN_REVOKED = 'Refresh token has been revoked',
  EMAIL_REQUIRED = 'Email is required',
  PASSWORD_REQUIRED = 'Password is required',
  INVALID_EMAIL = 'Must be a valid email address',
  EMAIL_AND_PASSWORD_REQUIRED = 'Email and password are required',
  INVALID_CREDENTIALS = 'Invalid credentials',
  TELEGRAM_GATEWAY_ERROR = 'Telegram Gateway error',
}

export enum SuccessMessage {
  OTP_SENT = 'OTP sent successfully',
  AUTH_SUCCESS = 'Authentication successful',
  LOGGED_OUT = 'Logged out successfully',
}
