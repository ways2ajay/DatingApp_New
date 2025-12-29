export type Pagination = {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export type PaginationResult<T>= {
    metadata: Pagination;
    items: T[];
}