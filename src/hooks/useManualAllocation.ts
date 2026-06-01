import { useCallback } from "react";
import type { AllocationState } from "../types";
import { bankersRound } from "../utils/priceHelper";

export const useManualAllocation = (
	setAllocationState: React.Dispatch<
		React.SetStateAction<AllocationState | null>
	>,
) => {
	const updateQtyAndWarehouse = useCallback(
		(subOrderId: string, params: { qty?: number; warehouseId?: string }) => {
			setAllocationState((prev) => {
				if (!prev) return prev;

				const orderMap = { ...prev.byId };
				const warehouseMap = { ...prev.warehouseMap };
				const customerMap = { ...prev.customerMap };
				const currentOrder = { ...orderMap[subOrderId] };

				if (!currentOrder) return prev;

				const customerId = currentOrder.customerId;
				const activeCustomer = { ...customerMap[customerId] };

				const oldWarehouseId = currentOrder.actualWarehouseId;
				warehouseMap[oldWarehouseId] = { ...warehouseMap[oldWarehouseId] };
				warehouseMap[oldWarehouseId].stock = bankersRound(
					warehouseMap[oldWarehouseId].stock + currentOrder.allocatedQty,
				);

				if (params.warehouseId) {
					currentOrder.actualWarehouseId = params.warehouseId;
				}

				const targetQty = params.qty ?? currentOrder.allocatedQty;
				const newWarehouseId = currentOrder.actualWarehouseId;
				warehouseMap[newWarehouseId] = { ...warehouseMap[newWarehouseId] };

				activeCustomer.creditUsed = bankersRound(
					Math.max(0, activeCustomer.creditUsed - currentOrder.totalCost),
				);

				let finalAllocated = Math.min(
					Math.max(0, targetQty),
					warehouseMap[newWarehouseId].stock,
				);

				const availableCredit = bankersRound(
					Math.max(0, activeCustomer.creditLimit - activeCustomer.creditUsed),
				);
				const costForNewQty = bankersRound(
					finalAllocated * currentOrder.unitPrice,
				);

				if (availableCredit < costForNewQty) {
					finalAllocated = Math.floor(availableCredit / currentOrder.unitPrice);
				}

				const finalCost = bankersRound(finalAllocated * currentOrder.unitPrice);
				warehouseMap[newWarehouseId].stock = bankersRound(
					warehouseMap[newWarehouseId].stock - finalAllocated,
				);

				currentOrder.allocatedQty = finalAllocated;
				currentOrder.totalCost = finalCost;
				currentOrder.status =
					finalAllocated >= currentOrder.requestedQty &&
					currentOrder.requestedQty > 0
						? "Fulfilled"
						: finalAllocated > 0
							? "Partial"
							: "Unfulfilled";
				currentOrder.shortageQty = bankersRound(
					Math.max(0, currentOrder.requestedQty - finalAllocated),
				);

				orderMap[subOrderId] = currentOrder;

				let totalCreditUsed = 0;
				prev.allIds.forEach((id) => {
					if (orderMap[id].customerId === customerId) {
						totalCreditUsed = bankersRound(
							totalCreditUsed + orderMap[id].totalCost,
						);
					}
				});

				activeCustomer.creditUsed = totalCreditUsed;
				customerMap[customerId] = activeCustomer;

				prev.allIds.forEach((id) => {
					if (orderMap[id].customerId === customerId) {
						orderMap[id] = { ...orderMap[id], creditUsed: totalCreditUsed };
					}
				});

				return { ...prev, byId: orderMap, warehouseMap, customerMap };
			});
		},
		[setAllocationState],
	);

	return { updateQtyAndWarehouse };
};