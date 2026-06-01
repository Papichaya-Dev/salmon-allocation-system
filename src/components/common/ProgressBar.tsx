interface ProgressBarProps {
	value: number;
	max: number;
	variant?: "stock" | "credit";
}

export default function ProgressBar({
	value,
	max,
	variant = "stock",
}: ProgressBarProps) {
	const percentage =
		max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;

	const getBarColor = (percent: number) => {
		if (variant === "credit") {
			if (percent >= 90) return "bg-rose-500";
			if (percent >= 70) return "bg-amber-500";
			return "bg-emerald-500";
		} else {
			if (percent >= 50) return "bg-emerald-500";
			if (percent >= 20) return "bg-amber-500";
			return "bg-rose-500";
		}
	};

	return (
		<div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-2">
			<div
				className={`h-full rounded-full transition-all duration-500 ease-out ${getBarColor(percentage)}`}
				style={{ width: `${percentage}%` }}
			/>
		</div>
	);
}