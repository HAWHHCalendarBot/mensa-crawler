type PriceInEuro = number

export interface MealPrices {
	PriceAttendant: PriceInEuro;
	PriceGuest: PriceInEuro;
	PriceStudent: PriceInEuro;
}

export interface Meal extends MealPrices {
	Name: string;
	Category: string;
	Date: string;
	Beef: boolean;
	Fish: boolean;
	LactoseFree: boolean;
	Pig: boolean;
	Poultry: boolean;
	Vegan: boolean;
	Vegetarian: boolean;
	Additives: Record<string, string>;
}
