import { useCallback } from "react";
import type { AllocationState } from "../types";
import { bankersRound } from "../utils/priceHelper";

export const useManualAllocation = (
	setAllocationState: React.Dispatch<
		React.SetStateAction<AllocationState | null>
	>,
) => {
	const updateAllocatedQty = useCallback(
		(subOrderId: string, newQty: number) => {
			setAllocationState((prevResult) => {
				if (!prevResult) return prevResult;

				const orderMap = { ...prevResult.byId };
				const warehouseMap = { ...prevResult.warehouseMap };
				const customerMap = { ...prevResult.customerMap };

				const currentOrder = { ...orderMap[subOrderId] };
				if (!currentOrder) return prevResult;

				const warehouseId = currentOrder.actualWarehouseId || currentOrder.warehouseId;
				const customerId = currentOrder.customerId;

				const activeWarehouse = { ...warehouseMap[warehouseId] };
				const activeCustomer = { ...customerMap[customerId] };

				activeWarehouse.stock = bankersRound(
					activeWarehouse.stock + currentOrder.allocatedQty,
				);
				activeCustomer.creditUsed = bankersRound(
					Math.max(0, activeCustomer.creditUsed - currentOrder.totalCost),
				);

				let finalAllocated = Math.min(
					Math.max(0, newQty),
					activeWarehouse.stock,
				);

				const costForNewQty = bankersRound(
					finalAllocated * currentOrder.unitPrice,
				);
				const availableCredit = bankersRound(
					Math.max(0, activeCustomer.creditLimit - activeCustomer.creditUsed),
				);

				if (availableCredit < costForNewQty) {
					finalAllocated = Math.floor(availableCredit / currentOrder.unitPrice);
				}

				const finalCost = bankersRound(finalAllocated * currentOrder.unitPrice);
				activeWarehouse.stock = bankersRound(
					activeWarehouse.stock - finalAllocated,
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
				warehouseMap[warehouseId] = activeWarehouse;

				let totalCreditUsed = 0;
				prevResult.allIds.forEach((id) => {
					if (orderMap[id].customerId === customerId) {
						totalCreditUsed = bankersRound(
							totalCreditUsed + orderMap[id].totalCost,
						);
					}
				});

				activeCustomer.creditUsed = totalCreditUsed;
				customerMap[customerId] = activeCustomer;

				prevResult.allIds.forEach((id) => {
					if (orderMap[id].customerId === customerId) {
						orderMap[id] = { ...orderMap[id], creditUsed: totalCreditUsed };
					}
				});

				return {
					...prevResult,
					byId: orderMap,
					warehouseMap: { ...warehouseMap },
					customerMap: { ...customerMap },
				};
			});
		},
		[setAllocationState],
	);
	return { updateAllocatedQty };
};