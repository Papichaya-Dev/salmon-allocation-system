import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";

interface DropdownProps<T extends string> {
	label: string;
	value: T;
	onChange: (newValue: T) => void;
	options: { value: T; label: string }[];
	minWidth?: string;
}

export const CustomDropdown = <T extends string>({
	label,
	value,
	onChange,
	options,
	minWidth = "140px",
}: DropdownProps<T>) => {
	const currentLabel =
		options.find((option) => option.value === value)?.label || String(value);

	return (
		<div className="flex items-center gap-2 shrink-0 select-none font-sans">
			<span className="text-[13px] text-slate-500 font-medium">{label}</span>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					style={{ minWidth }}
					className="flex items-center justify-between gap-3 pl-4 pr-3 py-1.5 text-[14px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer"
				>
					<span className="truncate">{currentLabel}</span>
				</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content
						align="start"
						sideOffset={4}
						className="z-50 min-w-40 bg-white border border-slate-100 rounded-xl p-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.08)] focus:outline-none animate-in fade-in-50 zoom-in-95 duration-100"
					>
						{options.map((option) => {
							const isSelected = value === option.value;

							return (
								<DropdownMenu.Item
									key={option.value}
									onClick={() => onChange(option.value)}
									className={`
                                        flex items-center justify-between px-3 py-2 text-[14px] rounded-lg outline-none cursor-pointer transition-colors
                                        ${isSelected
                                            ? "bg-[#FDF2EC] text-[#E06D3B] font-medium"
                                            : "text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                                        }
                                    `}
								>
									<span>{option.label}</span>
									{isSelected && (
										<Check className="w-4 h-4"/>
									)}
								</DropdownMenu.Item>
							);
						})}
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</div>
	);
};