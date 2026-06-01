import { useEffect } from "react";
import AllocationFilters from "../components/AllocationFilters";
import DashboardOverview from "../components/DashboardOverview";
import OrderTable from "../components/OrderTable";
import { OrderToolbar } from "../components/OrderToolbar";
import WarehouseStock from "../components/WarehouseStock";
import { useAllocationFilters } from "../hooks/useAllocationFilters";
import { useAutoAllocation } from "../hooks/useAutoAllocation";
import { useManualAllocation } from "../hooks/useManualAllocation";

function SalmonAllocationPage() {
    const { allocationState, setAllocationState, runAutoAllocation, isLoading } = useAutoAllocation();
	const { filteredOrders, ...filterProps } =
		useAllocationFilters(allocationState);
	const { updateQtyAndWarehouse } = useManualAllocation(setAllocationState);
	
    useEffect(() => {
        runAutoAllocation();
    },[runAutoAllocation]);

	return (
		<div className="min-h-screen bg-[#f7f0f1] font-sans pb-6">
			<OrderToolbar
				isLoading={isLoading}
				onRunAutoAllocation={runAutoAllocation}
			/>
			<div className="px-3">
				<DashboardOverview result={allocationState} />
				<WarehouseStock warehouses={allocationState?.warehouseMap} />
				<AllocationFilters
					{...filterProps}
					totalOrder={filteredOrders.length}
				/>
				<OrderTable
					orders={filteredOrders}
					warehouses={allocationState?.warehouseMap ?? {}}
					customers={allocationState?.customerMap ?? {}}
					onUpdateQtyAndWarehouse={updateQtyAndWarehouse}
				/>
			</div>
		</div>
	);
}

export default SalmonAllocationPage;