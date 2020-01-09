import got from 'got'

import {Canteen, canteenWeekUrl} from '../canteen'
import {Meal} from '../meal'
import {weekNumber} from '../weeknumber'

import {loadCanteenFromSource, loadMealsFromSource} from './source'

export async function loadCanteens(): Promise<Canteen[]> {
	const response = await got('http://www.studierendenwerk-hamburg.de/studierendenwerk/de/essen/speiseplaene/')
	const canteens = loadCanteenFromSource(response.body)
	return canteens
}

export async function loadMealsOfCanteenCurrentlyKnown(canteen: Canteen): Promise<Meal[]> {
	const today = new Date()
	const currentYear = today.getFullYear()
	const currentWeek = weekNumber(today)

	const resultsArr = await Promise.all([
		loadMealsOfCanteen(canteen, currentYear, currentWeek),
		loadMealsOfCanteen(canteen, currentYear, currentWeek + 1)
	])

	const results = resultsArr.flat()
	return results
}

async function loadMealsOfCanteen(canteen: Canteen, year: number, week: number): Promise<Meal[]> {
	const url = canteenWeekUrl(canteen.id, year, week)
	const response = await got(url)
	const meals = loadMealsFromSource(response.body)
	return meals
}
