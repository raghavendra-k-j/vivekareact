import { EasyTableData } from "./types.ts";

export function calculatePaginationCount(data: EasyTableData<any>) {
    if (data.totalItems === 0) {
        return {
            startIndex: 0,
            endIndex: 0,
            totalCount: 0
        };
    }

    const startIndex = (data.currentPage - 1) * data.pageSize + 1;
    const endIndex = Math.min(data.currentPage * data.pageSize, data.totalItems);
    
    return {
        startIndex,
        endIndex,
        totalCount: data.totalItems
    };
}