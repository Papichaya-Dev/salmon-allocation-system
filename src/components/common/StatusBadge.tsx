import {
	AlertCircle,
	Calendar,
	CheckCircle2,
	Clock,
	Flame,
    Loader,
} from "lucide-react";
import React from "react";
import type { AllocationStatus, OrderPriority } from "../../types";

export type BadgeType = OrderPriority | AllocationStatus;

interface StatusBadgeProps {
	type: BadgeType;
}

export default function StatusBadge({ type }: StatusBadgeProps) {
	const badgeConfig = React.useMemo(() => {
		const config: Record<
			BadgeType,
			{
				background: string;
				borderColor: string;
				text: string;
				icon: React.ReactNode;
				label: string;
			}
		> = {
			EMERGENCY: {
				background: "bg-rose-50",
				borderColor: "border-rose-200",
				text: "text-rose-800",
				icon: <Flame className="w-3.5 h-3.5 stroke-[2.5]" />,
				label: "EMERGENCY",
			},
			OVER_DUE: {
				background: "bg-amber-50",
				borderColor: "border-amber-200",
				text: "text-amber-800",
				icon: <Clock className="w-3.5 h-3.5 stroke-[2.5]" />,
				label: "OVER DUE",
			},
			DAILY: {
				background: "bg-[#dff2fe]",
				borderColor: "border-[#9ed7fb]",
				text: "text-[#519cca]",
				icon: <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />,
				label: "DAILY",
			},
			Fulfilled: {
				background: "bg-emerald-50",
				borderColor: "border-emerald-200",
				text: "text-emerald-800",
				icon: <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />,
				label: "Fulfilled",
			},
			Partial: {
				background: "bg-amber-50/70",
				borderColor: "border-amber-200/80",
				text: "text-amber-800",
				icon: <Loader className="w-3.5 h-3.5 stroke-[2.5]" />,
				label: "Partial",
			},
			Unfulfilled: {
				background: "bg-slate-100",
				borderColor: "border-slate-300",
				text: "text-slate-500",
				icon: <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />,
				label: "Unfulfilled",
			},
		};

		return config[type];
	}, [type]);

	return (
		<div
			className={`
            inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold tracking-wide
            select-none transition-all duration-200
            ${badgeConfig.background} ${badgeConfig.borderColor} ${badgeConfig.text}
        `}
		>
			<span className="shrink-0 flex items-center justify-center">
				{badgeConfig.icon}
			</span>
			<span className="leading-none mt-0.5 font-sans">{badgeConfig.label}</span>
		</div>
	);
}