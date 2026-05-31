import { useEffect, useMemo } from "react";
import DashboardOverview from "../components/DashboardOverview";
import Header from "../components/Header";
import OrderTable from "../components/OrderTable";
import WarehouseStock from "../components/WarehouseStock";
import { useAutoAllocation } from "../hooks/useAutoAllocation";
import { useManualAllocation } from "../hooks/useManualAllocation";

function SalmonAllocationPage() {
    const { result, setResult, runAutoAllocation } = useAutoAllocation();
	const { updateAllocatedQty } = useManualAllocation(setResult);
	
    useEffect(() => {
        runAutoAllocation();
    },[runAutoAllocation]);

	const mappedOrders = useMemo(() => {
		if (!result?.allIds || !result?.byId || !result?.updatedCustomers)
			return [];

		return result.allIds.map((id) => {
			const order = result.byId[id];
			const customer = result.updatedCustomers[order.customerId];
			return {
				...order,
				customerName: customer.name,
			};
		});
	}, [result]);

	return (
		<div className="min-h-screen bg-[#f7f0f1] font-sans">
			<div className="mx-auto bg-[#FFFAF5] border border-slate-200/60 shadow-sm p-6 mb-3">
				<Header />
			</div>
			<div className="px-3">
				<DashboardOverview result={result} />
				<WarehouseStock warehouses={result?.updatedWarehouses} />
				<div className="my-4">
					<OrderTable
						orders={mappedOrders}
						onSaveAllocatedQty={updateAllocatedQty}
						warehouses={result?.updatedWarehouses ?? {}}
						customers={result?.updatedCustomers ?? {}}
					/>
				</div>
			</div>
		</div>
	);
}

export default SalmonAllocationPage;