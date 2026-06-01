import type {
	AllocationResult,
	AllocationState,
	AllocationStatus,
	Customer,
	SubOrder,
	Supplier,
	Warehouse,
} from "../../types";
import {
	bankersRound,
	calculateNetUnitPrice,
	getBasePrice,
} from "../../utils/priceHelper";

export const executeAutoAllocation = (
	rawSubOrders: SubOrder[],
	currentWarehouses: Warehouse[],
	currentSuppliers: Supplier[],
	currentCustomers: Customer[],
): AllocationState => {
	const priorityWeight: Record<string, number> = {
		EMERGENCY: 3,
		OVER_DUE: 2,
		DAILY: 1,
	};

	const sortedSubOrders = [...rawSubOrders].sort((orderA, orderB) => {
		if (priorityWeight[orderA.priority] !== priorityWeight[orderB.priority]) {
			return priorityWeight[orderB.priority] - priorityWeight[orderA.priority];
		}
		return orderA.createdAt.localeCompare(orderB.createdAt);
	});

	const warehouseMap: Record<string, Warehouse> = {};
	for (const warehouse of currentWarehouses) {
		warehouseMap[warehouse.id] = { ...warehouse };
	}

	const supplierMap: Record<string, Supplier> = {};
	for (const supplier of currentSuppliers) {
		supplierMap[supplier.id] = { ...supplier };
	}

	const customerMap: Record<string, Customer> = {};
	for (const customer of currentCustomers) {
		customerMap[customer.id] = { ...customer };
	}

	const customerUsedCreditMap: Record<string, number> = {};
	const byId: Record<string, AllocationResult> = {};
	const allIds: string[] = [];

	for (const currentOrder of sortedSubOrders) {
		allIds.push(currentOrder.id);

		let chosenWarehouseId = currentOrder.warehouseId;
		let chosenSupplierId = currentOrder.supplierId;

		if (chosenWarehouseId === "WH-000") {
			let highestStock = -1;
			let bestWarehouseId = "WH-001";

			for (const warehouse of Object.values(warehouseMap)) {
				if (warehouse.stock > highestStock) {
					highestStock = warehouse.stock;
					bestWarehouseId = warehouse.id;
				}
			}
			chosenWarehouseId = bestWarehouseId;
		}

		if (chosenSupplierId === "SP-000") {
			let lowerPrice = Infinity;
			let bestSupplierId = "SP-001";

			for (const supplier of Object.values(supplierMap)) {
				const checkPrice = getBasePrice(currentOrder.itemId, supplier.id);
				if (checkPrice < lowerPrice) {
					lowerPrice = checkPrice;
					bestSupplierId = supplier.id;
				}
			}
			chosenSupplierId = bestSupplierId;
		}

		const basePrice = getBasePrice(currentOrder.itemId, chosenSupplierId);
		const unitPrice = calculateNetUnitPrice(basePrice, currentOrder.priority);

		const customerInfo = customerMap[currentOrder.customerId];
		const totalCreditLimit = customerInfo ? customerInfo.creditLimit : 50000;
		const alreadyUsedCredit =
			customerUsedCreditMap[currentOrder.customerId] || 0;
		const availableCredit = Math.max(0, totalCreditLimit - alreadyUsedCredit);

		const maxQtyAllowedByCredit = bankersRound(availableCredit / unitPrice);

		let allowedQtyByCredit = Math.min(
			currentOrder.requestedQty,
			maxQtyAllowedByCredit,
		);
		if (allowedQtyByCredit < 0) {
			allowedQtyByCredit = 0;
		}

		let allocatedFromWarehouse = 0;
		let finalAllocationStatus: AllocationStatus = "Unfulfilled";

		const activeWarehouse = warehouseMap[chosenWarehouseId];

		if (
			activeWarehouse &&
			activeWarehouse.stock > 0 &&
			allowedQtyByCredit > 0
		) {
			if (activeWarehouse.stock > allowedQtyByCredit) {
				allocatedFromWarehouse = allowedQtyByCredit;
				activeWarehouse.stock = bankersRound(
					activeWarehouse.stock - allowedQtyByCredit,
				);
				finalAllocationStatus = "Fulfilled";
			} else {
				allocatedFromWarehouse = activeWarehouse.stock;
				activeWarehouse.stock = 0;
				finalAllocationStatus = "Partial";
			}
		}

		const shortageQty = bankersRound(
			currentOrder.requestedQty - allocatedFromWarehouse,
		);

		let totalOrderCost = bankersRound(allocatedFromWarehouse * unitPrice);

		if (
			allowedQtyByCredit === maxQtyAllowedByCredit &&
			allocatedFromWarehouse === allowedQtyByCredit
		) {
			totalOrderCost = availableCredit;
		}
		customerUsedCreditMap[currentOrder.customerId] = bankersRound(
			alreadyUsedCredit + totalOrderCost,
		);

		byId[currentOrder.id] = {
			...currentOrder,
			allocatedQty: allocatedFromWarehouse,
			unitPrice,
			totalCost: totalOrderCost,
			status: finalAllocationStatus,
			actualWarehouseId: chosenWarehouseId,
			actualSupplierId: chosenSupplierId,
			shortageQty,
			customerName: customerInfo.name,
			creditLimit: totalCreditLimit,
			creditUsed: 0,
		};
	}

	Object.keys(customerUsedCreditMap).forEach((customerId) => {
		if (customerMap[customerId]) {
			customerMap[customerId] = {
				...customerMap[customerId],
				creditUsed: customerUsedCreditMap[customerId],
			};
		}
	});

	for (const id of allIds) {
		const order = byId[id];
		order.creditUsed = customerUsedCreditMap[order.customerId];
	}

	return {
		allIds,
		byId,
		warehouseMap,
		customerMap,
	};
};
