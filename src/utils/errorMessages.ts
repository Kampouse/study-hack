/**
 * Centralized error messages for consistent, human-readable error handling
 */

export const ErrorMessages = {
  // Authentication & User errors
  USER_NOT_FOUND: "We couldn't find your account. Please try logging in again.",
  USER_NOT_AUTHENTICATED: "Please log in to continue.",
  USER_ALREADY_EXISTS: "An account with this email already exists.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",

  // Event errors
  EVENT_NOT_FOUND: "This event could not be found. It may have been removed.",
  EVENT_CREATE_FAILED: "We couldn't create your event. Please check your details and try again.",
  EVENT_LOAD_FAILED: "We couldn't load events. Please refresh the page.",
  EVENT_UPDATE_FAILED: "We couldn't update the event. Please try again.",

  // Place errors
  PLACE_NOT_FOUND: "This place could not be found.",
  PLACE_CREATE_FAILED: "We couldn't create this place. Please check your details and try again.",
  PLACE_LOAD_FAILED: "We couldn't load places. Please refresh the page.",
  PLACE_UPDATE_FAILED: "We couldn't update the place. Please try again.",

  // Join request errors
  JOIN_REQUEST_FAILED: "We couldn't submit your request. Please check your answers and try again.",
  JOIN_REQUEST_DUPLICATE: "You've already requested to join this event.",
  JOIN_REQUEST_NOT_FOUND: "This join request could not be found.",

  // Validation errors
  VALIDATION_FAILED: "Please check your input and try again.",
  INVALID_DATA: "Some of the information you entered is invalid. Please check and try again.",

  // Network & Server errors
  NETWORK_ERROR: "Connection problem. Please check your internet and try again.",
  SERVER_ERROR: "Something went wrong on our end. Please try again in a moment.",
  DATABASE_ERROR: "We're having trouble accessing our database. Please try again.",

  // User stats & data
  USER_STATS_FAILED: "We couldn't load your statistics. Please try again.",
  USER_PLACES_FAILED: "We couldn't load your places. Please try again.",
  CONFIRMED_USERS_FAILED: "We couldn't load the attendee list. Please try again.",

  // Profile errors
  PROFILE_UPDATE_FAILED: "We couldn't update your profile. Please try again.",

  // Generic fallback
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
};

/**
 * Format field-specific validation errors
 */
export const FieldErrors = {
  required: (fieldName: string) => `${fieldName} is required`,
  minLength: (fieldName: string, min: number) =>
    `${fieldName} must be at least ${min} characters`,
  maxLength: (fieldName: string, max: number) =>
    `${fieldName} cannot exceed ${max} characters`,
  invalidUrl: (fieldName: string) =>
    `Please enter a valid URL for ${fieldName}`,
  invalidFormat: (fieldName: string) =>
    `${fieldName} format is invalid`,
};

/**
 * Convert unknown error to human-readable message
 */
export function formatError(error: unknown, fallback = ErrorMessages.UNKNOWN_ERROR): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String(error.message) || fallback;
  }

  return fallback;
}

/**
 * Get context-specific error message based on operation type
 */
export function getContextualError(
  operation: "create" | "update" | "delete" | "fetch",
  resourceType: "event" | "place" | "user" | "request",
  error?: unknown
): string {
  const contextMap = {
    event: {
      create: ErrorMessages.EVENT_CREATE_FAILED,
      update: ErrorMessages.EVENT_UPDATE_FAILED,
      delete: "We couldn't delete the event. Please try again.",
      fetch: ErrorMessages.EVENT_LOAD_FAILED,
    },
    place: {
      create: ErrorMessages.PLACE_CREATE_FAILED,
      update: ErrorMessages.PLACE_UPDATE_FAILED,
      delete: "We couldn't delete the place. Please try again.",
      fetch: ErrorMessages.PLACE_LOAD_FAILED,
    },
    user: {
      create: "We couldn't create your account. Please try again.",
      update: ErrorMessages.PROFILE_UPDATE_FAILED,
      delete: "We couldn't delete your account. Please try again.",
      fetch: ErrorMessages.USER_NOT_FOUND,
    },
    request: {
      create: ErrorMessages.JOIN_REQUEST_FAILED,
      update: "We couldn't update your request. Please try again.",
      delete: "We couldn't cancel your request. Please try again.",
      fetch: ErrorMessages.JOIN_REQUEST_NOT_FOUND,
    },
  };

  const baseMessage = contextMap[resourceType]?.[operation] || ErrorMessages.UNKNOWN_ERROR;

  // If there's additional error info, you can append or replace
  if (error) {
    const errorMsg = formatError(error);
    // Only append if it adds useful info beyond the base message
    if (errorMsg && errorMsg !== baseMessage && errorMsg !== ErrorMessages.UNKNOWN_ERROR) {
      return `${baseMessage} (${errorMsg})`;
    }
  }

  return baseMessage;
}

/**
 * Check if error is a network/connectivity issue
 */
export function isNetworkError(error: unknown): boolean {
  const errorStr = String(error).toLowerCase();
  return (
    errorStr.includes("network") ||
    errorStr.includes("fetch") ||
    errorStr.includes("connection") ||
    errorStr.includes("timeout")
  );
}

/**
 * Check if error is an authentication issue
 */
export function isAuthError(error: unknown): boolean {
  const errorStr = String(error).toLowerCase();
  return (
    errorStr.includes("unauthorized") ||
    errorStr.includes("authentication") ||
    errorStr.includes("session") ||
    errorStr.includes("token")
  );
}
