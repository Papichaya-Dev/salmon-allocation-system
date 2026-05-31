import type { AllocationResult, Customer } from "../types";

export interface CustomerCreditMap {
	[customerId: string]: {
		creditLimit: number;
		creditUsed: number;
	};
}

export const calculateAllCustomersCredit = (
	orders: AllocationResult[],
	customers: Record<string, Customer>,
): CustomerCreditMap => {
	const creditMap: CustomerCreditMap = {};

	for (const order of orders) {
		if (!creditMap[order.customerId]) {
			const customer = customers[order.customerId];
			creditMap[order.customerId] = {
				creditLimit: customer?.creditLimit,
				creditUsed: 0,
			};
		}

		creditMap[order.customerId].creditUsed += order.totalCost || 0;
	}

	return creditMap;
};