import {Canteen, canteenWeekUrl} from '../canteen'
import {Meal} from '../meal'
import {request} from '../network'
import {weekNumber} from '../weeknumber'

import {loadCanteenFromSource, loadMealsFromSource} from './source'

export async function loadCanteens(): Promise<Canteen[]> {
	const response = await request('http://www.studierendenwerk-hamburg.de/studierendenwerk/de/essen/speiseplaene/')
	const canteens = loadCanteenFromSource(response.body)
	return canteens
}

export async function loadMealsOfCanteenCurrentlyKnown(canteen: Canteen): Promise<Meal[]> {
	const today = new Date()
	const currentYear = today.getFullYear()
	const currentWeek = weekNumber(today)

	const results = [
		...(await loadMealsOfCanteen(canteen, currentYear, currentWeek)),
		...(await loadMealsOfCanteen(canteen, currentYear, currentWeek + 1))
	]

	return results
}

async function loadMealsOfCanteen(canteen: Canteen, year: number, week: number): Promise<Meal[]> {
	const url = canteenWeekUrl(canteen.id, year, week)
	const response = await request(url)
	const meals = loadMealsFromSource(response.body)
	return meals
}
