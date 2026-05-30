import { useEffect } from "react";
import DashboardOverview from "../components/Dashboard/DashboardOverview";
import Header from "../components/Header";
import { useAutoAllocation } from "../hooks/useAutoAllocation";

function SalmonAllocationPage() {
    const { result, runAutoAllocation } = useAutoAllocation();

    useEffect(() => {
        runAutoAllocation();
    },[runAutoAllocation]);

	return (
		<div className="min-h-screen bg-[#f7f0f1] font-sans">
			<div
				className="mx-auto bg-[#FFFAF5] border border-slate-200/60 shadow-sm p-6 mb-3"
			>
				<Header />
			</div>
			<div className="px-3">
				<DashboardOverview result={result} />
			</div>
		</div>
	);
}

export default SalmonAllocationPage;