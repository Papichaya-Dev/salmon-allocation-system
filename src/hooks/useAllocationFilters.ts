import { useMemo, useState } from "react";
import type {
	AllocationResult,
	AllocationState,
	PriorityFilterType,
	StatusFilterType,
} from "../types";
import { useDebounce } from "./useDebounce";

export const useAllocationFilters = (result: AllocationState | null) => {
	const [searchTextInput, setSearchTextInput] = useState<string>("");
	const [selectedStatus, setSelectedStatus] =
		useState<StatusFilterType>("ALL");
	const [selectedPriority, setSelectedPriority] =
		useState<PriorityFilterType>("ALL");

	const debouncedSearchQuery = useDebounce(searchTextInput, 300);

	const filteredOrders = useMemo(() => {
		if (!result) return [];

		const filtered: AllocationResult[] = [];
		const searchQuery = debouncedSearchQuery.trim().toLowerCase();

		for (const id of result.allIds) {
			const order = result.byId[id];
			if (!order) continue;
			if (selectedPriority !== "ALL" && order.priority !== selectedPriority) {
				continue;
			}
			if (selectedStatus !== "ALL" && order.status !== selectedStatus) {
				continue;
			}
			if (searchQuery !== "") {
				const matchesSearch =
					order.id.toLowerCase().includes(searchQuery) ||
					order.itemId.toLowerCase().includes(searchQuery) ||
					order.customerName.toLowerCase().includes(searchQuery) ||
					order.warehouseId.toLowerCase().includes(searchQuery);
				if (!matchesSearch) {
					continue;
				}
			}

			filtered.push(order);
		}

		return filtered;
	}, [result, debouncedSearchQuery, selectedStatus, selectedPriority]);

	return {
		searchTextInput,
		setSearchTextInput,
		selectedStatus,
		setSelectedStatus,
		selectedPriority,
		setSelectedPriority,
		filteredOrders,
	};
};
