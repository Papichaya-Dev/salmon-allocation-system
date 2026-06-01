import { WarehouseIcon } from "lucide-react";
import React from "react";
import { mockWarehouses } from "../core/generators/mockGenerator";
import type { Warehouse } from "../types";
import { formatPrice } from "../utils/priceHelper";
import ProgressBar from "./common/ProgressBar";

interface WarehouseCardProps {
	id: string;
	name: string;
	currentStock: number;
	maxStockMap: number;
}

interface WarehouseStockProps {
	warehouses: Record<string, Warehouse> | undefined;
}

const WarehouseCard = React.memo(
	({ id, name, currentStock, maxStockMap }: WarehouseCardProps) => {
		return (
			<div className="bg-white p-3 rounded-xl border border-slate-200/50 flex flex-col justify-between">
				<div>
					<span className="text-[11px] font-bold text-slate-400 tracking-tight block uppercase">
						{id}
					</span>
					<h4
						className="text-sm font-bold text-slate-800 tracking-tight"
						title={name}
					>
						{name}
					</h4>
				</div>
				<div className="mt-3 flex items-baseline gap-1">
					<span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
						{formatPrice(currentStock)}
					</span>
					<span className="text-xs text-slate-400 font-medium tracking-tight">
						kg
					</span>
					<span className="text-[10px] text-slate-400 font-normal tracking-tight ml-auto">
						Max: {formatPrice(maxStockMap)} kg
					</span>
				</div>
				<ProgressBar value={currentStock} max={maxStockMap} />
			</div>
		);
	},
);

export default function WarehouseStock({ warehouses }: WarehouseStockProps) {
    const warehouseList = warehouses ? Object.values(warehouses) : [];

	const maxStockMap = React.useMemo(() => {
		const map: Record<string, number> = {};
		mockWarehouses.forEach((warehouse) => {
			map[warehouse.id] = warehouse.stock;
		});
		return map;
	}, []);

	return (
		<div className="bg-white border border-slate-200/70 rounded-2xl shadow-2xs p-3">
			<div className="flex items-center gap-2 mb-3 text-slate-500">
				<WarehouseIcon className="w-4 h-4 text-slate-500" />
				<h3 className="text-base font-bold tracking-tight">Warehouse Stock</h3>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
				{warehouseList.map((warehouse) => (
					<WarehouseCard
						key={warehouse.id}
						id={warehouse.id}
						name={warehouse.name}
						currentStock={warehouse.stock}
						maxStockMap={maxStockMap[warehouse.id]}
					/>
				))}
			</div>
		</div>
	);
}