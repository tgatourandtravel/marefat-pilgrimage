/**
 * Form Validation Utilities
 * Comprehensive validation functions for booking form fields
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate required field (non-empty)
 */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.length === 0) {
    return {
      valid: false,
      error: `${fieldName} is required`,
    };
  }
  return { valid: true };
}

/**
 * Validate email format (RFC 5322 compliant)
 */
export function validateEmail(email: string): ValidationResult {
  const trimmed = email?.trim();
  
  if (!trimmed) {
    return {
      valid: false,
      error: "Email is required",
    };
  }

  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(trimmed)) {
    return {
      valid: false,
      error: "Please enter a valid email address",
    };
  }

  return { valid: true };
}

/**
 * Validate phone number (international format, works with react-phone-number-input)
 * Accepts formats like: +1 234 567 8900, +44 20 1234 5678, etc.
 */
export function validatePhone(phone: string): ValidationResult {
  const trimmed = phone?.trim();
  
  if (!trimmed) {
    return {
      valid: false,
      error: "Phone number is required",
    };
  }

  // Remove spaces, dashes, parentheses for validation
  const cleaned = trimmed.replace(/[\s\-()]/g, '');
  
  // Must start with + and contain 10-15 digits
  const phoneRegex = /^\+\d{10,15}$/;
  
  if (!phoneRegex.test(cleaned)) {
    return {
      valid: false,
      error: "Please enter a valid phone number",
    };
  }

  return { valid: true };
}

/**
 * Validate passport number
 * US format: 9 alphanumeric characters
 * International fallback: 6-9 characters
 */
export function validatePassportNumber(passportNumber: string, nationality?: string): ValidationResult {
  const trimmed = passportNumber?.trim().toUpperCase();
  
  if (!trimmed) {
    return {
      valid: false,
      error: "Passport number is required",
    };
  }

  // Check for US passport format (9 alphanumeric)
  if (nationality?.toLowerCase().includes('us') || nationality?.toLowerCase().includes('united states')) {
    const usPassportRegex = /^[A-Z0-9]{9}$/;
    if (!usPassportRegex.test(trimmed)) {
      return {
        valid: false,
        error: "US passport numbers must be 9 alphanumeric characters",
      };
    }
  } else {
    // International passport: 6-9 characters, alphanumeric
    const intlPassportRegex = /^[A-Z0-9]{6,9}$/;
    if (!intlPassportRegex.test(trimmed)) {
      return {
        valid: false,
        error: "Passport number must be 6-9 alphanumeric characters",
      };
    }
  }

  return { valid: true };
}

/**
 * Validate passport expiry date
 * Must be at least 6 months after tour start date
 */
export function validatePassportExpiry(
  expiryDate: string,
  tourStartDate: string
): ValidationResult {
  if (!expiryDate) {
    return {
      valid: false,
      error: "Passport expiry date is required",
    };
  }

  if (!tourStartDate) {
    // If no tour start date, just check it's a future date
    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (expiry <= today) {
      return {
        valid: false,
        error: "Passport has expired or expires today",
      };
    }
    return { valid: true };
  }

  const expiry = new Date(expiryDate);
  const tourStart = new Date(tourStartDate);
  
  // Calculate 6 months after tour start
  const sixMonthsAfterTour = new Date(tourStart);
  sixMonthsAfterTour.setMonth(sixMonthsAfterTour.getMonth() + 6);
  
  if (expiry < sixMonthsAfterTour) {
    const formattedDate = sixMonthsAfterTour.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    
    return {
      valid: false,
      error: `Passport must be valid for at least 6 months from travel date (until ${formattedDate})`,
    };
  }

  return { valid: true };
}

/**
 * Validate date of birth
 * Optional: Check minimum age requirement
 */
export function validateDateOfBirth(
  dateOfBirth: string,
  minAge: number = 0
): ValidationResult {
  if (!dateOfBirth) {
    return {
      valid: false,
      error: "Date of birth is required",
    };
  }

  const dob = new Date(dateOfBirth);
  const today = new Date();
  
  // Check if date is in the future
  if (dob > today) {
    return {
      valid: false,
      error: "Date of birth cannot be in the future",
    };
  }

  // Check minimum age if specified
  if (minAge > 0) {
    const age = Math.floor((today.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < minAge) {
      return {
        valid: false,
        error: `Traveler must be at least ${minAge} years old`,
      };
    }
  }

  return { valid: true };
}

/**
 * Validate nationality field
 */
export function validateNationality(nationality: string): ValidationResult {
  const trimmed = nationality?.trim();
  
  if (!trimmed || trimmed.length < 2) {
    return {
      valid: false,
      error: "Nationality is required",
    };
  }

  // Only allow letters and spaces
  const nationalityRegex = /^[a-zA-Z\s]+$/;
  if (!nationalityRegex.test(trimmed)) {
    return {
      valid: false,
      error: "Nationality should only contain letters",
    };
  }

  return { valid: true };
}

/**
 * Validate name fields (first name, last name)
 */
export function validateName(name: string, fieldName: string): ValidationResult {
  const trimmed = name?.trim();
  
  if (!trimmed || trimmed.length < 2) {
    return {
      valid: false,
      error: `${fieldName} must be at least 2 characters`,
    };
  }

  // Only allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(trimmed)) {
    return {
      valid: false,
      error: `${fieldName} should only contain letters`,
    };
  }

  return { valid: true };
}

/**
 * Validate booker fields (person making the reservation)
 */
export function validateBookerFields(
  booker: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }
): Record<string, string> {
  const errors: Record<string, string> = {};

  // Validate first name
  const firstNameResult = validateName(booker.firstName, "First name");
  if (!firstNameResult.valid) {
    errors.firstName = firstNameResult.error!;
  }

  // Validate last name
  const lastNameResult = validateName(booker.lastName, "Last name");
  if (!lastNameResult.valid) {
    errors.lastName = lastNameResult.error!;
  }

  // Validate email
  const emailResult = validateEmail(booker.email);
  if (!emailResult.valid) {
    errors.email = emailResult.error!;
  }

  // Validate phone
  const phoneResult = validatePhone(booker.phone);
  if (!phoneResult.valid) {
    errors.phone = phoneResult.error!;
  }

  return errors;
}

/**
 * Validate traveler fields (passport info only, no email/phone)
 * Returns an object with field names as keys and error messages as values
 */
export function validateTravelerFields(
  traveler: {
    firstName: string;
    lastName: string;
    passportNumber: string;
    nationality: string;
    passportExpiry: string;
    dateOfBirth: string;
  },
  tourStartDate?: string,
  skipNameValidation?: boolean // For when booker is traveler 1
): Record<string, string> {
  const errors: Record<string, string> = {};

  // Validate first name (unless skipped for booker)
  if (!skipNameValidation) {
    const firstNameResult = validateName(traveler.firstName, "First name");
    if (!firstNameResult.valid) {
      errors.firstName = firstNameResult.error!;
    }

    // Validate last name
    const lastNameResult = validateName(traveler.lastName, "Last name");
    if (!lastNameResult.valid) {
      errors.lastName = lastNameResult.error!;
    }
  }

  // Validate passport number
  const passportResult = validatePassportNumber(traveler.passportNumber, traveler.nationality);
  if (!passportResult.valid) {
    errors.passportNumber = passportResult.error!;
  }

  // Validate nationality
  const nationalityResult = validateNationality(traveler.nationality);
  if (!nationalityResult.valid) {
    errors.nationality = nationalityResult.error!;
  }

  // Validate passport expiry
  const expiryResult = validatePassportExpiry(traveler.passportExpiry, tourStartDate || '');
  if (!expiryResult.valid) {
    errors.passportExpiry = expiryResult.error!;
  }

  // Validate date of birth
  const dobResult = validateDateOfBirth(traveler.dateOfBirth);
  if (!dobResult.valid) {
    errors.dateOfBirth = dobResult.error!;
  }

  return errors;
}
