import { mockPriceRules } from "../core/generators/mockGenerator";
import type { OrderPriority, PriceRule } from "../types";

export function bankersRound(
	numberValue: number,
	decimalPlaces: number = 2,
): number {
	const multiplier = 10 ** decimalPlaces;

	const shiftedNumber = +(numberValue * multiplier).toFixed(8);
	const standardRounded = Math.round(shiftedNumber);

	const isExactlyHalf = Math.abs(shiftedNumber) % 1 === 0.5;

	const bankersRoundedValue = isExactlyHalf
		? standardRounded % 2 === 0
			? standardRounded
			: standardRounded - Math.sign(shiftedNumber)
		: standardRounded;

	return bankersRoundedValue / multiplier;
};

export function getBasePrice(
	itemId: string,
	supplierId: string,
	priceRules: PriceRule[] = mockPriceRules,
): number {
	if (supplierId === "SP-000") {
		const matchedRules = priceRules.filter((rule) => rule.itemId === itemId);
		if (matchedRules.length > 0) {
			return matchedRules.reduce(
				(min, rule) => (rule.basePrice < min ? rule.basePrice : min),
				matchedRules[0].basePrice,
			);
		}
		return 100.0;
	}

	const matchedRule = priceRules.find(
		(rule) => rule.itemId === itemId && rule.supplierId === supplierId,
	);
	return matchedRule ? matchedRule.basePrice : 100.0;
};

export function calculateNetUnitPrice(
	basePrice: number,
	priority: OrderPriority,
): number {
	let tierMultiplier = 1.0;

	if (priority === "EMERGENCY") {
		tierMultiplier = 1.25;
	} else if (priority === "DAILY") {
		tierMultiplier = 0.9;
	}

	return bankersRound(basePrice * tierMultiplier, 2);
};

export const formatPrice = (
	value: number | string | undefined | null,
): string => {
	if (value === undefined || value === null) return "0.00";

	const num = typeof value === "string" ? parseFloat(value) : value;
	if (Number.isNaN(num)) return "0.00";

	return num.toLocaleString("th-TH", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};