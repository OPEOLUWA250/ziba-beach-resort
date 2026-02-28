import { PostgrestError } from "@supabase/supabase-js";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

/**
 * Handle Supabase errors consistently across the application
 */
export function handleSupabaseError(error: any): {
  message: string;
  statusCode: number;
} {
  if (!error) {
    return {
      message: "An unknown error occurred",
      statusCode: 500,
    };
  }

  // PostgreSQL error codes
  if (error.code === "23505") {
    // Unique constraint violation
    return {
      message: "This record already exists",
      statusCode: 409,
    };
  }

  if (error.code === "23503") {
    // Foreign key violation
    return {
      message: "Referenced record not found",
      statusCode: 400,
    };
  }

  if (error.code === "PGRST116") {
    // Not found
    return {
      message: "Record not found",
      statusCode: 404,
    };
  }

  if (error.message?.includes("JWT")) {
    return {
      message: "Authentication failed",
      statusCode: 401,
    };
  }

  if (error.message?.includes("permission denied")) {
    return {
      message: "Permission denied",
      statusCode: 403,
    };
  }

  // Default error handling
  return {
    message: error.message || "An error occurred",
    statusCode: 500,
  };
}

/**
 * Format a successful API response
 */
export function successResponse<T>(
  data: T,
  statusCode: number = 200,
): ApiResponse<T> {
  return {
    success: true,
    data,
    statusCode,
  };
}

/**
 * Format an error API response
 */
export function errorResponse(
  message: string,
  statusCode: number = 500,
): ApiResponse<null> {
  return {
    success: false,
    error: message,
    statusCode,
  };
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
  body: any,
  requiredFields: string[],
): { valid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter((field) => !body[field]);

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate date range
 */
export function isValidDateRange(
  startDate: Date | string,
  endDate: Date | string,
): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return start < end;
}

/**
 * Convert string to date with validation
 */
export function parseDate(dateString: string): Date | null {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Calculate nights between two dates
 */
export function calculateNights(startDate: Date, endDate: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const nights = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / millisecondsPerDay,
  );
  return Math.max(nights, 0);
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
