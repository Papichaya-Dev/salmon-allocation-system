import { Fish, RefreshCcw } from "lucide-react";
import { Button } from "./common/Button";

interface ToolbarProps {
	onRunAutoAllocation: () => void;
	isLoading: boolean;
}

export const OrderToolbar = ({ onRunAutoAllocation, isLoading }: ToolbarProps) => {
	return (
		<div className="mx-auto bg-slate-800 p-4 mb-2 shadow-sm">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="flex items-start gap-3">
					<div className="p-2 bg-[#FFE3D6] rounded-xl border border-orange-100">
						<Fish className="h-6 w-6 text-orange-600" />
					</div>
					<div>
						<h1 className="text-xl font-bold text-white leading-none">
							Salmon Allocation
						</h1>
						<p className="text-xs text-white mt-1.5">
							Order Management System
						</p>
					</div>
				</div>
				<div className="flex items-center gap-3 self-end sm:self-center text-sm">
					<Button
						label="Run auto-allocation"
						icon={RefreshCcw}
						className="bg-[#f55a3b] px-4 py-2 text-white"
						onClick={onRunAutoAllocation}
						isLoading={isLoading}
					/>
				</div>
			</div>
		</div>
	);
};