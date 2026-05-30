import { useCallback, useState } from "react";
import { executeAutoAllocation } from "../core/allocators/autoAllocator";
import {
	initialCustomers,
	initialOrders,
	mockSuppliers,
	mockWarehouses,
} from "../core/generators/mockGenerator";
import type { AllocationState } from "../types";

export const useAutoAllocation = () => {
	const [result, setResult] = useState<AllocationState | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const runAutoAllocation = useCallback(
		async (
			rawSubOrders = initialOrders,
			rawWarehouses = mockWarehouses,
			rawSuppliers = mockSuppliers,
			rawCustomers = initialCustomers,
		) => {
			setIsLoading(true);
			setErrorMessage(null);

			try {
				const allocationResult = executeAutoAllocation(
					rawSubOrders,
					rawWarehouses,
					rawSuppliers,
					rawCustomers,
				);

				setResult(allocationResult);
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
		result,
		setResult,
		isLoading,
		errorMessage,
		runAutoAllocation,
	};
};
