import { useCallback } from "react";
import type { AllocationResult, AllocationState, AllocationStatus } from "../types";
import { bankersRound } from "../utils/priceHelper";

export const useManualAllocation = (
	setAllocationState: React.Dispatch<
		React.SetStateAction<AllocationState | null>
	>,
) => {
	const updateAllocatedQty = useCallback(
		(subOrderId: string, newQty: number) => {
			let finalAllocated = Math.max(0, newQty);

			setAllocationState((prevResult) => {
				if (!prevResult) return prevResult;

				const currentOrder = prevResult.byId[subOrderId];
				if (!currentOrder) return prevResult;

				const warehouseMap = { ...prevResult.warehouseMap };
				const customerMap = { ...prevResult.customerMap };
				const orderMap = { ...prevResult.byId };

				const activeWarehouse =
					warehouseMap[
						currentOrder.actualWarehouseId || currentOrder.warehouseId
					];
				const activeCustomer = customerMap[currentOrder.customerId];

				if (!activeWarehouse || !activeCustomer) return prevResult;

				activeWarehouse.stock = bankersRound(
					activeWarehouse.stock + currentOrder.allocatedQty,
				);
				activeCustomer.creditUsed = bankersRound(
					Math.max(0, activeCustomer.creditUsed - currentOrder.totalCost),
				);

				if (activeWarehouse.stock >= finalAllocated) {
					activeWarehouse.stock = bankersRound(activeWarehouse.stock - finalAllocated);
				} else {
					finalAllocated = activeWarehouse.stock;
					activeWarehouse.stock = 0;
				}

				let totalCost = bankersRound(finalAllocated * currentOrder.unitPrice);
				const availableCredit = bankersRound(
					Math.max(0, activeCustomer.creditLimit - activeCustomer.creditUsed),
				);

				if (availableCredit >= totalCost) {
					activeCustomer.creditUsed = bankersRound(activeCustomer.creditUsed + totalCost);
				} else {
					activeWarehouse.stock = bankersRound(activeWarehouse.stock + finalAllocated);
					finalAllocated = 0;
					totalCost = 0;
				}

				let finalStatus: AllocationStatus = "Unfulfilled";
				if (
					finalAllocated >= currentOrder.requestedQty &&
					currentOrder.requestedQty > 0
				) {
					finalStatus = "Fulfilled";
				} else if (finalAllocated > 0) {
					finalStatus = "Partial";
				}

				orderMap[subOrderId] = {
					...currentOrder,
					requestedQty: currentOrder.requestedQty,
					allocatedQty: finalAllocated,
					totalCost,
					status: finalStatus,
					shortageQty: bankersRound(
						Math.max(0, currentOrder.requestedQty - finalAllocated),
					),
				};

				let totalCreditUsed = 0;
				const customerOrders: AllocationResult[] = [];

				prevResult.allIds.forEach((id: string) => {
					const order = orderMap[id];
					if (order && order.customerId === currentOrder.customerId) {
						totalCreditUsed = bankersRound(totalCreditUsed + order.totalCost);
						customerOrders.push(order);
					}
				});

				activeCustomer.creditUsed = totalCreditUsed;

				customerOrders.forEach((order) => {
					order.creditUsed = totalCreditUsed;
				});

				return {
					...prevResult,
					byId: orderMap,
					warehouseMap,
					customerMap,
				};
			});
		},
		[setAllocationState],
	);
	return { updateAllocatedQty };
};
