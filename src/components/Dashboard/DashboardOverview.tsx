import { AlertCircle, Ban, Check, CheckCircle2, Database, DollarSign } from "lucide-react";
import React, { useMemo } from "react";
import { totalOrders } from "../../core/generators/mockGenerator";
import type { AllocationState } from "../../types";
import { calculateDashboardStats } from "../../utils/dashboardStatsHelpers";
import { formatPrice } from "../../utils/priceHelper";

interface StatCardProps {
	title: string;
	value: string | number;
	subText: React.ReactNode;
	icon: React.ComponentType<{ className?: string }>;
	iconColor: string;
}

interface DashboardOverviewProps {
	result: AllocationState | null;
}

const StatCard = React.memo(
	({ title, value, subText, icon: Icon, iconColor }: StatCardProps) => {
		return (
			<div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs flex justify-between items-start hover:shadow-2x">
				<div>
					<span className="text-sm font-medium text-slate-500">{title}</span>
					<div className="text-2xl font-bold text-slate-900 mt-1.5 font-mono tracking-tight">
						{value}
					</div>
					<div className="mt-1 block">{subText}</div>
				</div>
				<div className={`p-2 rounded-lg ${iconColor}`}>
					<Icon className="w-5 h-5" />
				</div>
			</div>
		);
	},
);

export default function DashboardOverview({ result }: DashboardOverviewProps) {
    const stats = useMemo(() => {
        if (!result) {
            return {
                totalStock: 0,
                totalWarehouses: 0,
                fulfilledCount: 0,
                fulfilledPercentage: "0",
                totalBlockedOrders: 0,
                creditLimitBlockedCount: 0,
                totalRevenue: 0,
            };
        }
        return calculateDashboardStats(result);
    }, [result]);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
			<StatCard
				title="Remaining stock"
				value={`${formatPrice(stats.totalStock)} kg`}
				subText={
					<span className="text-xs text-slate-400 font-medium">
						across 5 warehouses
					</span>
				}
				icon={Database}
				iconColor="text-slate-600 bg-slate-50"
			/>
			<StatCard
				title="Orders Fulfilled"
				value={`${stats.fulfilledCount.toLocaleString()} / ${totalOrders.toLocaleString()}`}
				subText={
					<span className="text-xs text-emerald-600 font-bold flex flex-row items-center gap-1.5 mt-2.5">
						<Check className="w-3.5 h-3.5" /> Success{" "}
						{stats.fulfilledPercentage}%
					</span>
				}
				icon={CheckCircle2}
				iconColor="text-emerald-600 bg-emerald-50"
			/>
			<StatCard
				title="Unfulfilled & Partial"
				value={`${stats.totalBlockedOrders.toLocaleString()} orders`}
				subText={
					<span className="text-xs text-[#DB2C2C] font-bold flex flex-row items-center gap-1.5 mt-2.5">
						<Ban className="w-3.5 h-3.5" />
						<span>
							Credit Blocked: {stats.creditLimitBlockedCount.toLocaleString()}{" "}
							orders
						</span>
					</span>
				}
				icon={AlertCircle}
				iconColor="text-amber-600 bg-amber-50"
			/>
			<StatCard
				title="Allocated Revenue"
				value={`฿${formatPrice(stats.totalRevenue)}`}
				subText={null}
				icon={DollarSign}
				iconColor="text-blue-600 bg-blue-50"
			/>
		</div>
	);
}