import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Pagination metadata for list responses
 */
export class PaginationMetadata {
  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of items' })
  total: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Whether there is a next page' })
  hasNext: boolean;

  @ApiProperty({ description: 'Whether there is a previous page' })
  hasPrev: boolean;
}

/**
 * Sorting metadata for list responses
 */
export class SortingMetadata {
  @ApiPropertyOptional({ description: 'Field to sort by' })
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order (asc or desc)', enum: ['asc', 'desc'] })
  order?: 'asc' | 'desc';
}

/**
 * Generic API response wrapper with metadata
 */
export class ApiResponse<T> {
  @ApiProperty({ description: 'Response data' })
  data: T;

  @ApiProperty({ description: 'Response metadata' })
  meta: {
    timestamp: string;
    version: string;
  };

  constructor(data: T) {
    this.data = data;
    this.meta = {
      timestamp: new Date().toISOString(),
      version: '1.0',
    };
  }
}

/**
 * Paginated list response with metadata
 */
export class PaginatedResponse<T> {
  @ApiProperty({ description: 'Array of items', isArray: true })
  data: T[];

  @ApiProperty({ description: 'Response metadata including pagination' })
  meta: {
    timestamp: string;
    version: string;
    pagination: PaginationMetadata;
    sorting?: SortingMetadata;
  };

  constructor(
    data: T[],
    pagination: PaginationMetadata,
    sorting?: SortingMetadata,
  ) {
    this.data = data;
    this.meta = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      pagination,
      sorting,
    };
  }
}

/**
 * Standard error response format
 */
export class ErrorResponse {
  @ApiProperty({ description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ description: 'Error message' })
  message: string | string[];

  @ApiProperty({ description: 'Error type/name' })
  error: string;

  @ApiPropertyOptional({ description: 'Request path where error occurred' })
  path?: string;

  @ApiProperty({ description: 'Timestamp when error occurred' })
  timestamp: string;

  constructor(
    statusCode: number,
    message: string | string[],
    error: string,
    path?: string,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.path = path;
    this.timestamp = new Date().toISOString();
  }
}
