import type { PaginationResult } from "../types";

export function paginate<T>(
	items: T[],
	page: number,
	pageSize: number,
): PaginationResult<T> {
	const totalItems = items.length;
	const totalPages = Math.ceil(totalItems / pageSize) || 1;

	const currentPage = Math.max(1, Math.min(page, totalPages));

	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = startIndex + pageSize;

	const paginatedItems = items.slice(startIndex, endIndex);

	return {
		paginatedItems,
		totalPages,
		totalItems,
		currentPage,
	};
}