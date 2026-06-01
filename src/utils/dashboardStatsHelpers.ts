import type { AllocationState } from "../types";

export const calculateDashboardStats = (result: AllocationState) => {
	const orderResults = Object.values(result.byId);
	const totalOrders = orderResults.length;

	const totalStock = Object.values(result.warehouseMap).reduce(
		(sum, warehouse) => sum + warehouse.stock,
		0,
	);
	const totalWarehouses = Object.keys(result.warehouseMap).length;

	let fulfilledCount = 0;
	let partialCount = 0;
	let unfulfilledCount = 0;
	let totalRevenue = 0;

	for (const order of orderResults) {
		if (order.status === "Fulfilled") fulfilledCount++;
		if (order.status === "Partial") partialCount++;
		if (order.status === "Unfulfilled") unfulfilledCount++;

		totalRevenue += order.totalCost;
	}

	const fulfilledPercentage =
		totalOrders > 0 ? ((fulfilledCount / totalOrders) * 100).toFixed(0) : "0";

	return {
		totalStock,
		totalWarehouses,
		fulfilledCount,
		partialCount,
		unfulfilledCount,
		fulfilledPercentage,
		totalRevenue,
	};
};