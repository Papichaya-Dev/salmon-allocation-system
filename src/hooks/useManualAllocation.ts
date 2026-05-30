import { useCallback } from "react";
import type { AllocationState, AllocationStatus } from "../types";
import { bankersRound } from "../utils/priceHelper";

export const useManualAllocation = (
	setResult: React.Dispatch<React.SetStateAction<AllocationState | null>>,
) => {
	const updateRequestedQty = useCallback(
		(subOrderId: string, newQty: number) => {
			const targetQty = Math.max(0, newQty);

			setResult((prevResult) => {
				if (!prevResult) return prevResult;

				const currentOrder = prevResult.byId[subOrderId];
				if (!currentOrder) return prevResult;

				const warehouseMap = { ...prevResult.updatedWarehouses };
				const customerMap = { ...prevResult.updatedCustomers };
				const orderMap = { ...prevResult.byId };

				const activeWarehouse = warehouseMap[currentOrder.warehouseId];
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

				let allocatedQty = targetQty;
				let stockWarningMsg: string | null = null;
				let creditErrorMsg: string | null = null;

				if (activeWarehouse.stock > allocatedQty) {
					activeWarehouse.stock = bankersRound(
						activeWarehouse.stock - allocatedQty,
						2,
					);
				} else {
					allocatedQty = activeWarehouse.stock;
					activeWarehouse.stock = 0;
					stockWarningMsg = `Insufficient stock (Max allowed: ${allocatedQty} kg)`;
				}

				let totalCost = bankersRound(allocatedQty * currentOrder.unitPrice, 2);

				if (activeCustomer.creditLimit >= totalCost) {
					activeCustomer.creditLimit = bankersRound(
						activeCustomer.creditLimit - totalCost,
						2,
					);
				} else {
					activeWarehouse.stock = bankersRound(
						activeWarehouse.stock + allocatedQty,
						2,
					);
					totalCost = 0;
					creditErrorMsg = `Exceeded available credit limit`;
					stockWarningMsg = null;
				}

				let finalStatus: AllocationStatus = "Unfulfilled";
				if (allocatedQty === targetQty && targetQty > 0) {
					finalStatus = "Fulfilled";
				} else if (allocatedQty > 0) {
					finalStatus = "Partial";
				}

				orderMap[subOrderId] = {
					...currentOrder,
					requestedQty: targetQty,
					allocatedQty,
					totalCost,
					status: finalStatus,
					shortageQty: bankersRound(targetQty - allocatedQty, 2),
					stockWarning: stockWarningMsg,
					creditError: creditErrorMsg,
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
	return { updateRequestedQty };
};
