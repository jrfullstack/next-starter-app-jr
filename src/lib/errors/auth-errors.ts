// lib/errors/auth-errors.ts
export const AUTH_ERRORS = {
  MISSING_CREDENTIALS: "missing_credentials",
  INVALID_CREDENTIALS: "invalid_credentials",
  EMAIL_NOT_VERIFIED: "email_not_verified",
  MISSING_GOOGLE_INFO: "missing_google_info",
  DUPLICATE_DEVICE_OR_IP: "duplicate_device_or_ip",
  REGISTRATION_FAILED: "registration_failed",
  CHECK_IP_FAILED: "check_ip_failed",
  UNKNOWN_ERROR: "unknown_error",
  REGISTRATION_DISABLED: "registration_disabled",
} as const;

export type AuthErrorKey = keyof typeof AUTH_ERRORS;

export class AuthError extends Error {
  code: string;

  constructor(code: AuthErrorKey) {
    super(code);
    this.code = code;
    this.name = "AuthError";
  }
}
