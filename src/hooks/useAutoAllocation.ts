import { useCallback, useState } from "react";
import { executeAutoAllocation } from "../core/allocators/autoAllocator";
import {
	generateMockData,
	mockSuppliers,
	mockWarehouses,
	totalOrders,
} from "../core/generators/mockGenerator";
import type { AllocationState } from "../types";

export const useAutoAllocation = () => {
	const [allocationState, setAllocationState] =
		useState<AllocationState | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const runAutoAllocation = useCallback(
		async () => {
			setIsLoading(true);
			setErrorMessage(null);
			await new Promise((resolve) => setTimeout(resolve, 300));
			const initialData = generateMockData(totalOrders);
			try {
				const allocationResult = executeAutoAllocation(
					initialData.orders,
					mockWarehouses,
					mockSuppliers,
					initialData.customers,
				);

				setAllocationState(allocationResult);
			} catch (error: unknown) {
				setErrorMessage(
					error instanceof Error
						? error.message
						: "Failed to execute auto allocation.",
				);
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	return {
		allocationState,
		setAllocationState,
		isLoading,
		errorMessage,
		runAutoAllocation,
	};
};
