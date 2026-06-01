import { useEffect } from "react";
import AllocationFilters from "../components/AllocationFilters";
import DashboardOverview from "../components/DashboardOverview";
import Header from "../components/Header";
import OrderTable from "../components/OrderTable";
import WarehouseStock from "../components/WarehouseStock";
import { useAllocationFilters } from "../hooks/useAllocationFilters";
import { useAutoAllocation } from "../hooks/useAutoAllocation";
import { useManualAllocation } from "../hooks/useManualAllocation";

function SalmonAllocationPage() {
    const { allocationState, setAllocationState, runAutoAllocation } = useAutoAllocation();
	const { filteredOrders, ...filterProps } =
		useAllocationFilters(allocationState);
	const { updateAllocatedQty } = useManualAllocation(setAllocationState);
	
    useEffect(() => {
        runAutoAllocation();
    },[runAutoAllocation]);

	return (
		<div className="min-h-screen bg-[#f7f0f1] font-sans">
			<div className="mx-auto bg-[#FFFAF5] border border-slate-200/60 shadow-sm p-6 mb-3">
				<Header />
			</div>
			<div className="px-3">
				<DashboardOverview result={allocationState} />
				<WarehouseStock warehouses={allocationState?.warehouseMap} />
				<div className="my-4">
					<AllocationFilters
						{...filterProps}
						totalOrder={filteredOrders.length}
					/>
				</div>
				<div className="pb-4">
					<OrderTable
						orders={filteredOrders}
						onSaveAllocatedQty={updateAllocatedQty}
						warehouses={allocationState?.warehouseMap ?? {}}
					/>
				</div>
			</div>
		</div>
	);
}

export default SalmonAllocationPage;