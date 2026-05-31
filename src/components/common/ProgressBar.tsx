interface ProgressBarProps {
	value: number;
	max: number;
}

export default function ProgressBar({ value, max }: ProgressBarProps) {
	const percentage =
		max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;

	const getBarColor = (percent: number) => {
		if (percent >= 50) return "bg-emerald-500";
		if (percent >= 20) return "bg-amber-500";
		return "bg-rose-500";
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