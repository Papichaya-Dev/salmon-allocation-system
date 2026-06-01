import type {
	Customer,
	OrderPriority,
	PriceRule,
	SubOrder,
	Supplier,
	Warehouse,
} from "../../types";

export const totalOrders: number = 5200;

export const mockWarehouses: Warehouse[] = [
	{ id: "WH-001", name: "Bangkok Storage Hub", stock: 80000 },
	{ id: "WH-002", name: "Mahachai Seafood Center", stock: 100000 },
	{ id: "WH-003", name: "Rangsit Logistics Park", stock: 120000 },
	{ id: "WH-004", name: "Rama 2 Cold Center", stock: 150000 },
	{ id: "WH-005", name: "Suvarnabhumi Cargo Hub", stock: 210000 },
];

export const mockSuppliers: Supplier[] = [
	{ id: "SP-001", name: "Makro Wholesale" },
	{ id: "SP-002", name: "Lotus's Retail" },
	{ id: "SP-003", name: "Norway Salmon" },
	{ id: "SP-004", name: "Hokkaido Seafood" },
	{ id: "SP-005", name: "Pacific Marine" },
];

export const mockPriceRules: PriceRule[] = [
	{ itemId: "Item-1", supplierId: "SP-001", basePrice: 85.0 },
	{ itemId: "Item-1", supplierId: "SP-002", basePrice: 88.5 },
	{ itemId: "Item-1", supplierId: "SP-003", basePrice: 99.75 },
	{ itemId: "Item-1", supplierId: "SP-004", basePrice: 105.0 },
	{ itemId: "Item-1", supplierId: "SP-005", basePrice: 110.0 },
	{ itemId: "Item-2", supplierId: "SP-001", basePrice: 95.0 },
	{ itemId: "Item-2", supplierId: "SP-002", basePrice: 105.0 },
	{ itemId: "Item-2", supplierId: "SP-003", basePrice: 115.5 },
	{ itemId: "Item-2", supplierId: "SP-004", basePrice: 120.0 },
	{ itemId: "Item-2", supplierId: "SP-005", basePrice: 132.25 },
];

export const generateMockData = (
	totalRecords: number = 5500,
): {
	orders: SubOrder[];
	customers: Customer[];
} => {
	const orders: SubOrder[] = [];
	const customers: Customer[] = [];

	const brandNames = [
		"Sushiro",
		"Midori Sushi",
		"Fuji Restaurant",
		"Sushi Hiro",
		"Zen Restaurant",
		"Yayoi",
	];

	for (let index = 1; index <= 100; index++) {
		const customerId = `CT-${String(index).padStart(4, "0")}`;
		const brand = brandNames[index % brandNames.length];
		const customerName = `${brand} No.${index}`;

		customers.push({
			id: customerId,
			name: customerName,
			creditLimit: Math.floor(Math.random() * (1000000 - 50000 + 1) + 50000),
			creditUsed: 0,
		});
	}

	const priorities: OrderPriority[] = ["EMERGENCY", "OVER_DUE", "DAILY"];
	const items = ["Item-1", "Item-2"];
	const warehouses = [
		"WH-001",
		"WH-002",
		"WH-003",
		"WH-004",
		"WH-005",
		"WH-000",
	];
	const suppliers = [
		"SP-001",
		"SP-002",
		"SP-003",
		"SP-004",
		"SP-005",
		"SP-000",
	];

	let baseTime = new Date("2026-05-30T08:00:00.000Z").getTime();

	for (let index = 1; index <= totalRecords; index++) {
		const orderIndex = Math.ceil(index / 2);
		const subIndex = ((index - 1) % 2) + 1;

		const orderId = `ORDER-${String(orderIndex).padStart(4, "0")}`;
		const subOrderId = `${orderId}-${String(subIndex).padStart(3, "0")}`;

		const customer = customers[Math.floor(Math.random() * customers.length)];
		const priority = priorities[Math.floor(Math.random() * priorities.length)];
		const itemId = items[Math.floor(Math.random() * items.length)];

		const warehouseId =
			warehouses[Math.floor(Math.random() * warehouses.length)];
		const supplierId = suppliers[Math.floor(Math.random() * suppliers.length)];

		const requestedQty = Math.floor(Math.random() * (150 - 5 + 1) + 5);

		baseTime += Math.floor(Math.random() * (5 - 1 + 1) + 1) * 60 * 1000;
		const createdAt = new Date(baseTime).toISOString();

		orders.push({
			id: subOrderId,
			orderId: orderId,
			customerId: customer.id,
			itemId: itemId,
			warehouseId: warehouseId,
			supplierId: supplierId,
			requestedQty: requestedQty,
			priority: priority,
			createdAt: createdAt,
			remark: index % 15 === 0 ? "Special for VIP" : "",
		});
	}

	return {
		orders: orders,
		customers: customers,
	};
};

const mockDataResult = generateMockData(totalOrders);
export const initialOrders = mockDataResult.orders;
export const initialCustomers = mockDataResult.customers;