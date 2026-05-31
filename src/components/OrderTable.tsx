import { useVirtualizer } from "@tanstack/react-virtual";
import { Edit2, Save, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { AllocationResult, Customer, Warehouse } from "../types";
import { calculateAllCustomersCredit } from "../utils/creditHelper";
import { bankersRound, formatPrice } from "../utils/priceHelper";
import ProgressBar from "./common/ProgressBar";
import StatusBadge from "./common/StatusBadge";

const COLUMN_WIDTHS = {
	subOrder: "w-[160px] min-w-[160px]",
	customer: "w-[220px] min-w-[220px]",
	priority: "w-[135px] min-w-[135px]",
	requested: "w-[80px] min-w-[80px] text-right",
	allocated: "w-[140px] min-w-[140px] text-right pl-4",
	warehouse: "w-[140px] min-w-[140px] text-center",
	supplier: "w-[80px] min-w-[80px]",
	unitPrice: "w-[80px] min-w-[80px] text-right",
	total: "w-[120px] min-w-[120px] text-right",
	status: "w-[120px] min-w-[120px] flex justify-center",
	action: "w-[100px] min-w-[100px] text-center pl-2",
};

type MappedAllocationResult = AllocationResult & {
	customerName: string;
};

interface OrderTableProps {
	orders: MappedAllocationResult[];
	onSaveAllocatedQty: (orderId: string, newQty: number) => void;
	warehouses: Record<string, Warehouse>;
	customers: Record<string, Customer>;
}

export default function OrderTable({
	orders,
	onSaveAllocatedQty,
	warehouses,
	customers,
}: OrderTableProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	const [editingId, setEditingId] = useState<string | null>(null);
	const [editValue, setEditValue] = useState<string>("");
	const [validationError, setValidationError] = useState<{
		type: "stock" | "credit" | null;
		message: string | null;
	}>({ type: null, message: null });

	const customerCreditMap = useMemo(() => {
		return calculateAllCustomersCredit(orders, customers);
	}, [orders, customers]);

	/**
	 * NOTE: Bypassing React 19 Compiler to prevent stale UI issues,
	 * as TanStack's useVirtualizer returns functions that are unsafe to auto-memoize.
	 * Ref: https://github.com/TanStack/virtual/issues/1119
	 */
	// eslint-disable-next-line react-hooks/incompatible-library
	const rowVirtualizer = useVirtualizer({
		count: orders.length,
		getScrollElement: () => containerRef.current,
		estimateSize: () => 72,
		overscan: 5,
	});

	const onEditing = (order: AllocationResult) => {
		setEditingId(order.id);
		setEditValue(order.allocatedQty.toString());
		setValidationError({ type: null, message: null });
	};

	const onCancel = () => {
		setEditingId(null);
		setValidationError({ type: null, message: null });
	};

	const validateFields = (currentOrder: AllocationResult, inputQty: number) => {
		const warehouseId =
			currentOrder.actualWarehouseId || currentOrder.warehouseId;
		const activeWarehouse = warehouses[warehouseId];

		if (activeWarehouse) {
			const stockAvailable = bankersRound(
				activeWarehouse.stock + currentOrder.allocatedQty,
				2,
			);
			if (inputQty > stockAvailable) {
				setValidationError({
					type: "stock",
					message: `Max allowed: ${stockAvailable} kg`,
				});
				return false;
			}
		}

		const { creditLimit, creditUsed } = customerCreditMap[currentOrder.customerId];
		const newCost = bankersRound(inputQty * currentOrder.unitPrice, 2);

		if (creditUsed + newCost > creditLimit) {
			setValidationError({
				type: "credit",
				message: "Exceeded credit limit",
			});
			return false;
		}

		setValidationError({ type: null, message: null });
		return true;
	};

	const handleSaveAllocatedQty = (id: string) => {
		const numValue = parseFloat(editValue);
		if (!Number.isNaN(numValue) && numValue >= 0 && !validationError.message) {
			onSaveAllocatedQty(id, numValue);
			setEditingId(null);
			setValidationError({ type: null, message: null });
		}
	};

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		row: AllocationResult,
	) => {
		const value = event.target.value;
		setEditValue(value);

		const numValue = parseFloat(value);
		if (!Number.isNaN(numValue) && numValue >= 0) {
			validateFields(row, numValue);
		} else {
			setValidationError({ type: "stock", message: "Invalid quantity" });
		}
	};

	return (
		<div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden font-sans">
			<thead className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 text-slate-500 text-[11px] font-bold tracking-wider uppercase shadow-3xs">
				<tr className="flex items-center px-6 py-3.5">
					<th className={"w-40 min-w-40"}>Sub-Order</th>
					<th className={COLUMN_WIDTHS.customer}>Customer</th>
					<th className={COLUMN_WIDTHS.priority}>Priority</th>
					<th className={COLUMN_WIDTHS.requested}>Requested</th>
					<th className={COLUMN_WIDTHS.allocated}>Allocated</th>
					<th className={COLUMN_WIDTHS.warehouse}>Warehouse</th>
					<th className={COLUMN_WIDTHS.supplier}>Supplier</th>
					<th className={COLUMN_WIDTHS.unitPrice}>Unit Price</th>
					<th className={COLUMN_WIDTHS.total}>Total</th>
					<th className={COLUMN_WIDTHS.status}>Status</th>
					<th className={COLUMN_WIDTHS.action}>Action</th>
				</tr>
			</thead>
			<div
				ref={containerRef}
				className="overflow-auto relative min-h-50"
				style={{ height: `500px` }}
			>
				<table className="w-full text-left border-collapse table-fixed">
					<tbody
						className="block relative w-full"
						style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
					>
						{rowVirtualizer.getVirtualItems().map((virtualRow) => {
							const row = orders[virtualRow.index];
							const isEditing = editingId === row.id;
							const hasError = isEditing && !!validationError.message;
							const { creditLimit, creditUsed } =
								customerCreditMap[row.customerId];
							return (
								<tr
									key={row.id}
									data-index={virtualRow.index}
									ref={rowVirtualizer.measureElement}
									className={`flex items-center px-6 border-b border-slate-100 bg-white hover:bg-slate-50/60 transition-colors duration-100 absolute top-0 left-0 w-full`}
									style={{
										transform: `translateY(${virtualRow.start}px)`,
									}}
								>
									{/* Sub-Order */}
									<td className={COLUMN_WIDTHS.subOrder}>
										<div className="text-sm font-bold text-slate-800 leading-tight">
											{row.id}
										</div>
										<div className="text-[11px] font-medium text-slate-400 mt-0.5">
											{row.itemId}
										</div>
									</td>
									{/* Customer */}
									<td className={COLUMN_WIDTHS.customer}>
										<div className="flex flex-col gap-1 py-1 w-full">
											<div
												className="text-sm font-bold text-slate-800 truncate leading-tight"
												title={row.customerName}
											>
												{row.customerName}
											</div>
											<div className="w-[85%] flex flex-col gap-0.5">
												<span className="text-[11px] font-medium text-slate-400 leading-none">
													Credit ฿{formatPrice(creditUsed)} / ฿
													{formatPrice(creditLimit)}
												</span>
												<ProgressBar value={creditUsed} max={creditLimit} />
											</div>
										</div>
									</td>
									<td className={COLUMN_WIDTHS.priority}>
										<StatusBadge type={row.priority} />
									</td>
									{/* Requested */}
									<td
										className={`${COLUMN_WIDTHS.requested} text-sm font-bold text-slate-800`}
									>
										{formatPrice(row.requestedQty)}
									</td>
									{/* Allocated */}
									<td className={COLUMN_WIDTHS.allocated}>
										{isEditing ? (
											<div className="relative flex flex-col w-full">
												<input
													type="number"
													value={editValue}
													onChange={(e) => handleInputChange(e, row)}
													className={`w-full border-2 rounded-lg px-2 py-1.5 text-sm font-bold text-right transition-colors
                                                        ${hasError ? "border-rose-500 bg-rose-50/40 text-rose-900 " : "border-sky-500 bg-sky-50/30 text-slate-800 focus:ring-2"}
                                                    `}
												/>
												{hasError && (
													<span
														className={`absolute right-0 -bottom-4 text-[10px] font-bold tracking-tight bg-white px-1 whitespace-nowrap z-10
                                                        ${validationError.type === "credit" ? "text-rose-600" : "text-amber-600"}
                                                    `}
													>
														{validationError.message}
													</span>
												)}
											</div>
										) : (
											<span className="text-sm font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
												{formatPrice(row.allocatedQty)}
											</span>
										)}
									</td>
									{/* Warehouse */}
									<td
										className={`${COLUMN_WIDTHS.warehouse} text-sm font-semibold text-slate-600`}
									>
										{row.actualWarehouseId}
									</td>

									{/* Supplier */}
									<td
										className={`${COLUMN_WIDTHS.supplier} text-sm font-semibold text-slate-600`}
									>
										{row.actualSupplierId}
									</td>

									{/* Unit Price */}
									<td
										className={`${COLUMN_WIDTHS.unitPrice} text-sm font-medium text-slate-500`}
									>
										฿{formatPrice(row.unitPrice)}
									</td>
									{/* Total */}
									<td
										className={`${COLUMN_WIDTHS.total} text-sm font-bold text-slate-800`}
									>
										฿{formatPrice(row.totalCost)}
									</td>
									{/* Status */}
									<td className={COLUMN_WIDTHS.status}>
										<StatusBadge type={row.status} />
									</td>
									{/* Action Buttons */}
									<td
										className={`${COLUMN_WIDTHS.action} flex justify-center gap-2 items-center h-full`}
									>
										{isEditing ? (
											<>
												<button
													onClick={() => handleSaveAllocatedQty(row.id)}
													disabled={hasError}
													className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 shadow-xs
                                                        ${hasError ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none" : "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 cursor-pointer"}
                                                    `}
													title={
														hasError
															? "Please fix data errors before saving"
															: "Save changes"
													}
													type="button"
												>
													<Save className="w-4 h-4 stroke-[2.25]" />
													<span>Save</span>
												</button>
												<button
													onClick={onCancel}
													className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300 transition-colors cursor-pointer border border-transparent"
													title="Cancel"
													type="button"
												>
													<X className="w-4 h-4 stroke-[2.5]" />
												</button>
											</>
										) : (
											<button
												onClick={() => onEditing(row)}
												className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-800 text-xs font-bold cursor-pointer transition-colors"
												type="button"
											>
												<Edit2 className="w-3.5 h-3.5" />
												Edit
											</button>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}