import {promises as fsPromises} from 'fs'

import arrayFilterUnique from 'array-filter-unique'

import {Meal, MealPrices} from './meal'
import {saveCanteenMealFiles} from './fs'

export interface Additive {
	Key: string;
	Value: string;
}

export interface MealOld extends MealPrices {
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
	Additives: Additive[];
}

export async function migrateMealsOld(): Promise<void> {
		const mealDict: Record<string, Meal[]> = {}

	const canteens = await fsPromises.readdir('../data/meals')
	for (const canteen of canteens) {
		const fixedCanteenName = (canteen.startsWith('Caf') || canteen.startsWith('Mensa')) ?
			canteen :
			`Mensa ${canteen}`

		if (!mealDict[fixedCanteenName]) {
			mealDict[fixedCanteenName] = []
		}

		mealDict[fixedCanteenName].push(...(await mealsOfOldCanteen(canteen)))
	}

	for (const canteen of Object.keys(mealDict)) {
		await saveCanteenMealFiles(canteen, mealDict[canteen].filter(arrayFilterUnique(o => `${o.Date}${o.Name}`)))
	}
}

async function mealsOfOldCanteen(canteen: string): Promise<Meal[]> {
	const files = await fsPromises.readdir(`../data/meals/${canteen}`)

	const mealFileContent = await Promise.all(
		files
			.sort((a, b) => a.localeCompare(b))
			.map(async o => fsPromises.readFile(`../data/meals/${canteen}/${o}`, 'utf8'))
	)

	const meals = mealFileContent
		.flatMap(o => JSON.parse(o) as MealOld[])
		.map(o => migrateOldMealToNew(o))

	return meals
}

function migrateOldMealToNew(mealOld: MealOld): Meal {
	const {
		Beef,
		Pig,
		Poultry,
		PriceAttendant,
		PriceGuest,
		Category,
		Name,
		Fish,
		LactoseFree,
		PriceStudent,
		Vegan,
		Vegetarian
	} = mealOld

	const oldDateNumber = Number(/\d+/.exec(mealOld.Date)![0])
	const oldDate = new Date(oldDateNumber)
	const newDate = oldDate.toISOString()

	const newAdditives: Record<string, string> = {}
	for (const o of mealOld.Additives) {
		newAdditives[o.Key] = o.Value
	}

	return {
		Date: newDate,
		Additives: newAdditives,
		Beef,
		Category,
		Fish,
		LactoseFree,
		Name,
		Pig,
		Poultry,
		PriceAttendant,
		PriceGuest,
		PriceStudent,
		Vegan,
		Vegetarian
	}
}
