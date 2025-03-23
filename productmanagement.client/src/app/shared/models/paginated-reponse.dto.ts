export interface PaginatedResponseDTO<T> {
    hasNext: boolean;
    hasPrevious: boolean; 
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  }