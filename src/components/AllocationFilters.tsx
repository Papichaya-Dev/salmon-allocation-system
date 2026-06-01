import { Search } from "lucide-react";
import type { PriorityFilterType, StatusFilterType } from "../types";
import { CustomDropdown } from "./common/CustomDropdown";

interface AllocationFiltersProps {
	searchTextInput: string;
	setSearchTextInput: (value: string) => void;
	selectedStatus: StatusFilterType;
	setSelectedStatus: (value: StatusFilterType) => void;
	selectedPriority: PriorityFilterType;
	setSelectedPriority: (value: PriorityFilterType) => void;
	totalOrder: number;
}

export const AllocationFilters: React.FC<AllocationFiltersProps> = ({
	searchTextInput,
	setSearchTextInput,
	selectedStatus,
	setSelectedStatus,
	selectedPriority,
	setSelectedPriority,
	totalOrder,
}) => {
	const statusOptions: { value: StatusFilterType; label: string }[] = [
		{ value: "ALL", label: "All Statuses" },
		{ value: "Fulfilled", label: "Fulfilled" },
		{ value: "Partial", label: "Partial" },
		{ value: "Unfulfilled", label: "Unfulfilled" },
	];
	const priorityOptions: { value: PriorityFilterType; label: string }[] = [
		{ value: "ALL", label: "All Priorities" },
		{ value: "EMERGENCY", label: "Emergency" },
		{ value: "OVER_DUE", label: "Overdue" },
		{ value: "DAILY", label: "Daily" },
	];

	return (
		<div className="flex flex-wrap items-center gap-5 p-3 bg-white border border-slate-200/70 rounded-2xl w-full my-2">
			<div className="flex items-center gap-2 flex-1 min-w-65">
				<div className="relative w-full">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
					<input
						type="text"
						value={searchTextInput}
						onChange={(e) => setSearchTextInput(e.target.value)}
						placeholder="Search ID, customer, or warehouse..."
						className="w-full pl-9 pr-4 py-1.5 text-[14px] bg-slate-50/40 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 font-medium text-slate-700 placeholder-slate-400/70 transition-all"
					/>
				</div>
			</div>
			<CustomDropdown<PriorityFilterType>
				label="Priority"
				value={selectedPriority}
				onChange={setSelectedPriority}
				options={priorityOptions}
			/>
			<CustomDropdown<StatusFilterType>
				label="Status"
				value={selectedStatus}
				onChange={setSelectedStatus}
				options={statusOptions}
			/>
			<div className="flex items-center gap-2 ml-auto shrink-0 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-100">
				<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
					Found
				</span>
				<span className="text-sm font-bold text-slate-700">
					{totalOrder}{" "}
					<span className="text-xs font-medium text-slate-500">orders</span>
				</span>
			</div>
		</div>
	);
};

export default AllocationFilters;