import { Fish, RotateCcw, Sparkles } from "lucide-react";

export default function Header() {
  return (
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="flex items-start gap-3">
					<div className="p-2 bg-[#FFE3D6] text-orange-600 rounded-xl border border-orange-100">
						<Fish className="h-6 w-6" />
					</div>
					<div>
						<h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
							Salmon Allocation
						</h1>
						<p className="text-xs text-slate-500 mt-1.5">
							Order Management System
						</p>
					</div>
				</div>
				<div className="flex items-center gap-3 self-end sm:self-center text-sm">
					<button
						type="button"
						className="flex items-center gap-2 px-3 py-2 text-slate-700 font-medium hover:bg-[#E3FAEF] rounded-lg transition-colors cursor-pointer"
					>
						<RotateCcw className="w-4 h-4" />
						<span>Reset</span>
					</button>
					<button
						type="button"
						className="flex items-center gap-2 px-4 py-2 bg-[#F04E2E] hover:bg-[#D93B1C] text-white font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
					>
						<Sparkles className="w-4 h-4" />
						<span>Run auto-allocation</span>
					</button>
				</div>
			</div>
		);
}