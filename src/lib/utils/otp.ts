import { randomInt } from "crypto";

/**
 * Generate a 4-digit OTP code
 */
export function generateOTP(): string {
  return randomInt(1000, 10000).toString();
}

/**
 * Get OTP expiration time (10 minutes from now)
 */
export function getOTPExpiry(): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10);
  return expiry;
}

/**
 * Check if OTP is expired
 */
export function isOTPExpired(expiresAt: string | Date): boolean {
  const expiry = new Date(expiresAt);
  return new Date() > expiry;
}
