import type { AllocationState } from "../types";

export const calculateDashboardStats = (result: AllocationState) => {
	const orderResults = Object.values(result.byId);
	const totalOrders = orderResults.length;

	const totalStock = Object.values(result.updatedWarehouses).reduce(
		(sum, warehouse) => sum + warehouse.stock,
		0,
	);
	const totalWarehouses = Object.keys(result.updatedWarehouses).length;

	let fulfilledCount = 0;
	let partialCount = 0;
	let unfulfilledCount = 0;
	let totalRevenue = 0;
	let creditLimitBlockedCount = 0;

	for (const order of orderResults) {
		if (order.status === "Fulfilled") fulfilledCount++;
		if (order.status === "Partial") partialCount++;
		if (order.status === "Unfulfilled") unfulfilledCount++;

		totalRevenue += order.totalCost;

		if (order.allocatedQty < order.requestedQty && order.shortageQty > 0) {
			const activeWarehouse = result.updatedWarehouses[order.actualWarehouseId];
			if (activeWarehouse && activeWarehouse.stock > 0) {
				creditLimitBlockedCount++;
			}
		}
	}

	const fulfilledPercentage =
		totalOrders > 0 ? ((fulfilledCount / totalOrders) * 100).toFixed(0) : "0";
	const totalBlockedOrders = partialCount + unfulfilledCount;

	return {
		totalStock,
		totalWarehouses,
		fulfilledCount,
		fulfilledPercentage,
		totalBlockedOrders,
		creditLimitBlockedCount,
		totalRevenue,
	};
};