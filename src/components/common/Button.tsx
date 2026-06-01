import { Loader2, type LucideIcon } from "lucide-react";

interface ButtonProps {
	icon?: LucideIcon;
	label?: string;
	className?: string;
	iconClassName?: string;
	onClick?: () => void;
	isLoading?: boolean;
	disabled?: boolean;
}

export const Button = ({
	icon: Icon,
	label,
	className = "",
	iconClassName = "",
	onClick,
	isLoading = false,
	disabled = false,
}: ButtonProps) => {
	return (
		<button
			type={"button"}
			onClick={onClick}
			disabled={isLoading || disabled}
			className={`flex items-center gap-2 font-medium rounded-lg ${
				isLoading || disabled
					? "cursor-not-allowed opacity-70"
					: "cursor-pointer"
			} ${className}`}
		>
			{isLoading ? (
				<Loader2 className="w-4 h-4 animate-spin" />
			) : (
				Icon && <Icon className={`w-4 h-4 ${iconClassName}`} />
			)}
			{label && <span>{label}</span>}
		</button>
	);
};