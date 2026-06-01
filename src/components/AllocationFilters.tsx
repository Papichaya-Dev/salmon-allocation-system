import { Search } from "lucide-react";

interface AllocationFiltersProps {
	searchTextInput: string;
	setSearchTextInput: (value: string) => void;
	// selectedStatus: StatusFilterType;
	// setSelectedStatus: (value: StatusFilterType) => void;
	// selectedPriority: PriorityFilterType;
	// setSelectedPriority: (value: PriorityFilterType) => void;
	// totalResults: number;
}

export const AllocationFilters: React.FC<AllocationFiltersProps> = ({
	searchTextInput,
	setSearchTextInput,
	// selectedStatus,
	// setSelectedStatus,
	// selectedPriority,
	// setSelectedPriority,
	// totalResults,
}) => {
	return (
		<div className="flex items-center gap-4 p-3 bg-white border border-slate-200/60 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
			<div className="relative flex-1 min-w-70">
				<span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
					<Search className="w-3.5 h-3.5" />
				</span>
				<input
					type="text"
					value={searchTextInput}
					onChange={(e) => setSearchTextInput(e.target.value)}
					placeholder="Search by Order ID, order, Customer..."
					className="w-full pl-9 pr-4 py-1.5 text-[14px] text-slate-700 placeholder-slate-400/80 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 transition-colors"
				/>
			</div>
		</div>
	);
};

export default AllocationFilters;