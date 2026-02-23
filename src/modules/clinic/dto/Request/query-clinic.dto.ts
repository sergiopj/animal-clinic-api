/**
 * Query parameters for clinic listing endpoints
 * Supports both offset and cursor pagination with optional filters
 */
export interface ClinicQueryParams {
  // Offset-based pagination
  page?: string | number;
  limit?: string | number;
  
  // Cursor-based pagination
  cursor?: string;
  
  // Sorting
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | string;
  
  // Filters
  name?: string;
  city?: string;
  country?: string;
  isActive?: string | boolean;
}
