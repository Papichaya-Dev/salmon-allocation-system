export type OrderPriority = "EMERGENCY" | "OVER_DUE" | "DAILY";
export type AllocationStatus = "Fulfilled" | "Partial" | "Unfulfilled";

export interface SubOrder {
	id: string;
	orderId: string;
	customerId: string;
	itemId: string;
	warehouseId: string;
	supplierId: string;
	requestedQty: number;
	priority: OrderPriority;
	createdAt: string;
	remark?: string;
}

export interface Customer {
	id: string;
	name: string;
	creditLimit: number;
	creditUsed: number;
}

export interface Warehouse {
	id: string;
	name: string;
	stock: number;
}

export interface Supplier {
	id: string;
	name: string;
}

export interface PriceRule {
	itemId: string;
	supplierId: string;
	basePrice: number;
}

export interface AllocationResult extends SubOrder {
	allocatedQty: number;
	unitPrice: number;
	totalCost: number;
	status: AllocationStatus;
	actualWarehouseId: string;
	actualSupplierId: string;
	shortageQty: number;
	creditError?: string | null;
	stockWarning?: string | null;
	customerName: string;
	creditLimit: number,
	creditUsed: number;
}

export interface AllocationState {
	byId: { [subOrderId: string]: AllocationResult };
	allIds: string[];
	warehouseMap: { [warehouseId: string]: Warehouse };
	customerMap: { [customerId: string]: Customer };
	systemErrors?: { [subOrderId: string]: string };
}
