import { useCallback } from "react";
import type { AllocationState, AllocationStatus } from "../types";
import { bankersRound } from "../utils/priceHelper";

export const useManualAllocation = (
	setResult: React.Dispatch<React.SetStateAction<AllocationState | null>>,
) => {
	const updateAllocatedQty = useCallback(
		(subOrderId: string, newQty: number) => {
			let finalAllocated = Math.max(0, newQty);

			setResult((prevResult) => {
				if (!prevResult) return prevResult;

				const currentOrder = prevResult.byId[subOrderId];
				if (!currentOrder) return prevResult;

				const warehouseMap = { ...prevResult.updatedWarehouses };
				const customerMap = { ...prevResult.updatedCustomers };
				const orderMap = { ...prevResult.byId };

				const activeWarehouse =
					warehouseMap[
						currentOrder.actualWarehouseId || currentOrder.warehouseId
					];
				const activeCustomer = customerMap[currentOrder.customerId];

				if (!activeWarehouse || !activeCustomer) return prevResult;

				activeWarehouse.stock = bankersRound(
					activeWarehouse.stock + currentOrder.allocatedQty,
					2,
				);
				activeCustomer.creditLimit = bankersRound(
					activeCustomer.creditLimit + currentOrder.totalCost,
					2,
				);

				if (activeWarehouse.stock >= finalAllocated) {
					activeWarehouse.stock = bankersRound(
						activeWarehouse.stock - finalAllocated,
						2,
					);
				} else {
					finalAllocated = activeWarehouse.stock;
					activeWarehouse.stock = 0;
				}

				let totalCost = bankersRound(
					finalAllocated * currentOrder.unitPrice,
					2,
				);

				if (activeCustomer.creditLimit >= totalCost) {
					activeCustomer.creditLimit = bankersRound(
						activeCustomer.creditLimit - totalCost,
						2,
					);
				} else {
					activeWarehouse.stock = bankersRound(
						activeWarehouse.stock + finalAllocated,
						2,
					);
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
						2,
					),
				};

				return {
					...prevResult,
					byId: orderMap,
					updatedWarehouses: warehouseMap,
					updatedCustomers: customerMap,
				};
			});
		},
		[setResult],
	);
	return { updateAllocatedQty };
};
