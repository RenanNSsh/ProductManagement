export interface ApiErrorDto {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
} 