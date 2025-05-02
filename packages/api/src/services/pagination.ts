// src/services/pagination.ts
export interface PaginationQuery {
    page?: string | number;
    perPage?: string | number;
}

export function parsePagination(query: PaginationQuery): { skip: number; take: number } {
    // Coerce into numbers, apply defaults
    let page = Number(query.page) || 1;
    let perPage = Number(query.perPage) || 20;

    // Sanitize inputs
    page = page < 1 ? 1 : page;
    perPage = perPage < 1 ? 1 : Math.min(perPage, 100);  // cap at 100

    const skip = (page - 1) * perPage;
    return { skip, take: perPage };
}
