import { useMemo, useState } from "react";
import type {
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

		const allOrders = result.allIds.map((id) => result.byId[id]);

		return allOrders.filter((order) => {
			const matchesSearch =
				debouncedSearchQuery.trim() === "" ||
				order.id.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
				order.customerId
					.toLowerCase()
					.includes(debouncedSearchQuery.toLowerCase()) ||
				order.itemId.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

			const matchesStatus =
				selectedStatus === "ALL" || order.status === selectedStatus;
			const matchesPriority =
				selectedPriority === "ALL" || order.priority === selectedPriority;

			return matchesSearch && matchesStatus && matchesPriority;
		});
	}, [result, debouncedSearchQuery, selectedStatus, selectedPriority]);

	const resetFilters = () => {
		setSearchTextInput("");
		setSelectedStatus("ALL");
		setSelectedPriority("ALL");
	};

	return {
		searchTextInput,
		setSearchTextInput,
		selectedStatus,
		setSelectedStatus,
		selectedPriority,
		setSelectedPriority,
		filteredOrders,
		resetFilters,
	};
};
