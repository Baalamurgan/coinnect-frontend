export type WithPagination<T> = T & {
  pagination: {
    limit: number;
    page: number;
    total_pages: number;
    total_records: number;
  };
};
