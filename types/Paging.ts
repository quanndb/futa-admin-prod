export interface PagingRequest {
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  keyword?: string;
  ids?: string[];
  excludeIds?: string[];
}

export interface PagingResponse<T> {
  data: T[];
  page: Page;
}

export interface Page {
  pageIndex: number;
  pageSize: number;
  total: number;
}
