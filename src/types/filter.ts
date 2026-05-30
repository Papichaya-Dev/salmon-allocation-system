import type { AllocationStatus, OrderPriority } from "./allocation";

export type PriorityFilterType = OrderPriority | "ALL";
export type StatusFilterType = AllocationStatus | "ALL";

export interface PaginationResult<T> {
	paginatedItems: T[];
	totalPages: number;
	totalItems: number;
	currentPage: number;
}