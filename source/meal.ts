type PriceInEuro = number

export interface MealPrices {
	PriceAttendant: PriceInEuro;
	PriceGuest: PriceInEuro;
	PriceStudent: PriceInEuro;
}

export interface MealContents {
	Alcohol: boolean;
	Beef: boolean;
	Fish: boolean;
	LactoseFree: boolean;
	Pig: boolean;
	Poultry: boolean;
	Vegan: boolean;
	Vegetarian: boolean;
}

export interface Meal extends MealContents, MealPrices {
	Name: string;
	Category: string;
	Date: string;
	Additives: Record<string, string>;
}
