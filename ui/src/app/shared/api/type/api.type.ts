export type HttpStatus =
  'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL_SERVER_ERROR';

export interface ApiErrorResponse {
  status: HttpStatus;
  message: string;
}
