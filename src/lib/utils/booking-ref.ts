/**
 * Generate a unique booking reference
 * Format: MAR-XXXXX (5 alphanumeric characters)
 */
export function generateBookingRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars like O,0,I,1
  let ref = 'MAR-';
  for (let i = 0; i < 5; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

/**
 * Get booking expiration date (1 week from now)
 */
export function getBookingExpiry(): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return expiry;
}
