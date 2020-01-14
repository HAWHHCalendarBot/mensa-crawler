import {promises as fsPromises} from 'fs'

import arrayReduceGroupBy from 'array-reduce-group-by'

import {Meal, MealPrices} from './meal'
import {readMeals} from './fs'
import {run} from './gnuplot'
import {weekNumber} from './weeknumber'
import {writeCsvFile} from './csv-file'

const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MONTH = 30 * DAY

export async function doGraph(): Promise<void> {
	await fsPromises.mkdir('tmp', {recursive: true})

	const meals = await readMeals('Mensa Berliner-Tor')

	const words = ['Pommes', 'Twister']

	await Promise.all(words
		.map(async (o, i) => writeCsvFile(
			`tmp/word-include-${i + 1}.csv`,
			['Date', o.trim()],
			linesFromMeals(meals, i / (words.length + 1), m => m.Date.slice(0, 7), m => countWordIncluded(m, o.toLowerCase()))
		))
	)
	await run('word-include.gnuplot', `lines=${words.length}`)

	const priceClasses: Array<keyof MealPrices> = ['PriceGuest', 'PriceAttendant', 'PriceStudent']

	await Promise.all(priceClasses
		.map(async (o, i) => writeCsvFile(
			`tmp/price-${i + 1}.csv`,
			['Date', o.replace('Price', '').trim()],
			linesFromMeals(meals, 0, m => `${m.Date.slice(0, 5)}${weekNumber(new Date(Date.parse(m.Date)))}`, m => averagePrice(m, o))
		))
	)
	await run('price.gnuplot', `lines=${priceClasses.length}`)
}

function linesFromMeals(allMeals: readonly Meal[], offset: number, groupByFunc: (m: Meal) => string, amountFunc: (mealsOfMonth: readonly Meal[]) => number): string[] {
	const grouped = allMeals
		.reduce(arrayReduceGroupBy<string, Meal>(m => groupByFunc(m)), {})

	const lines = Object.values(grouped)
		.map(mealsOfInterest => {
			const amount = amountFunc(mealsOfInterest)
			const unixTimestamp = Math.min(...mealsOfInterest.map(o => Date.parse(o.Date) / 1000))
			return `${unixTimestamp + (offset * MONTH)}, ${amount}`
		})
		.filter(o => !o.includes('NaN'))

	return lines
}

function countWordIncluded(meals: readonly Meal[], wordIncluded: string): number {
	const hits = meals
		.filter(o => o.Name.toLocaleLowerCase().includes(wordIncluded))

	return hits
		.length
}

function averagePrice(meals: readonly Meal[], type: keyof MealPrices): number {
	const prices = meals
		.filter(o => o[type] > 0)
		// Exclude soup
		.filter(o => type === 'PriceStudent' ? o.PriceStudent > 1.4 : o.PriceAttendant > 3)
		.map(o => o[type])

	const sum = prices.reduce((a, b) => a + b, 0)
	const avg = sum / prices.length

	return avg
}

export function unixTimestampOfMonth(unixTimestamp: number): number {
	return Math.floor(unixTimestamp / MONTH) * MONTH
}
