export interface IApiResult<T> {
    data: T[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    sortColumn: string;
    sortOrder: string;
    filterColumn: string;
    filterQuery: string;
}