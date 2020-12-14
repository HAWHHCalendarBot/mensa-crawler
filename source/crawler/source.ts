import {Html5Entities as HtmlEntities} from 'html-entities'

import {Canteen} from '../canteen'
import {Meal, MealContents, MealPrices} from '../meal'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function allMatches(regex: Readonly<RegExp>, string: string): ReadonlyArray<Readonly<RegExpMatchArray>> {
	const results: RegExpMatchArray[] = []
	const localRegex = new RegExp(regex.source, regex.flags)
	let m: RegExpMatchArray | null
	while ((m = localRegex.exec(string))) {
		results.push(m)
	}

	return results
}

export function loadCanteenFromSource(content: string): Canteen[] {
	const entities = new HtmlEntities()
	const regex = /<a href="https?:\/\/speiseplan.studierendenwerk-hamburg.de\/index.php\/de\/cafeteria\/show\/id\/(\d+)" target="_blank">([^<]+)<\/a>/g
	const results: Canteen[] = allMatches(regex, content)
		.map(o => ({
			id: Number(o[1]!),
			name: entities.decode(o[2]!).replace(/-/g, ' ')
		}))

	return results
}

const CATEGORY_COLUMN_REGEX = /<th class=.category.>([^<]+)</
const MEAL_SWITCH = '</p>'
const DAY_SWITCH = '</td>'
const NAME_REGEX = /<strong>(.+)<\/strong>/
const ADDITIVE_REPLACE_REGEX = /<span class=tooltip title=([^>]+)>([^<]+)<\/span>/g
const PRICE_REGEX = /([\d,]+).€ \/ ([\d,]+).€ \/ ([\d,]+).€/
const BONUS_REGEX = /<img .+ title=.([^"]+).+\/>/
/* */

export function loadMealsFromSource(content: string): Meal[] {
	const meals: Meal[] = []

	const mondayMatch = /Wochenplan:\s+<br \/>(\d{2})\.(\d{2})\.(\d{4})/.exec(content)!
	const monday = Date.parse(`${mondayMatch[2]!}-${mondayMatch[1]!}-${mondayMatch[3]!} UTC`)

	const lines = content
		.split('\n')
		.map(o => o.trim())
		.filter(o => o)

	let currentWeekday = 0
	let currentCategory: string | undefined
	let name: string | undefined
	let prices: MealPrices | undefined
	let boniTexts: string[] = []
	let additives: Record<string, string> = {}

	for (const line of lines) {
		if (CATEGORY_COLUMN_REGEX.test(line)) {
			currentWeekday = 0
			currentCategory = CATEGORY_COLUMN_REGEX.exec(line)![1]
		} else if (line.includes(MEAL_SWITCH)) {
			if (!name || !currentCategory || !prices) {
				continue
			}

			const date = monday + (currentWeekday * DAY)

			meals.push({
				Name: name,
				Category: currentCategory,
				Date: new Date(date).toISOString(),
				...prices,
				...mealContentsFromBoniTexts(boniTexts),
				Additives: additives
			})

			name = undefined
			prices = undefined
			boniTexts = []
			additives = {}
		} else if (line.includes(DAY_SWITCH)) {
			currentWeekday++
			name = undefined
			prices = undefined
			boniTexts = []
			additives = {}
		} else if (NAME_REGEX.test(line)) {
			const nameHtml = NAME_REGEX.exec(line)![1]!

			for (const o of allMatches(ADDITIVE_REPLACE_REGEX, line)) {
				additives[o[2]!] = o[1]!
			}

			name = nameHtml
				.replace(ADDITIVE_REPLACE_REGEX, '$2')
				.replace(/<\/?strong>/g, '')
				.replace(/ {2}/g, ' ')
				.replace(/\) ,/g, '),')
				.trim()
		} else if (PRICE_REGEX.test(line)) {
			const match = PRICE_REGEX.exec(line)!
			prices = {
				PriceStudent: Number(match[1]!.replace(/,/g, '.')),
				PriceAttendant: Number(match[2]!.replace(/,/g, '.')),
				PriceGuest: Number(match[3]!.replace(/,/g, '.'))
			}
		} else if (BONUS_REGEX.test(line)) {
			boniTexts.push(
				BONUS_REGEX.exec(line)![1]!
			)
		}
	}

	return meals
}

function mealContentsFromBoniTexts(boniTexts: readonly string[]): MealContents {
	return {
		Alcohol: boniTexts.some(o => o === 'mit Alkohol'),
		Beef: boniTexts.some(o => o === 'mit Rind'),
		Fish: boniTexts.some(o => o === 'mit Fisch'),
		LactoseFree: boniTexts.some(o => o === 'laktosefrei' || o === 'enthält keine laktosehaltigen Lebensmittel'),
		Pig: boniTexts.some(o => o === 'mit Schwein'),
		Poultry: boniTexts.some(o => o === 'mit Geflügel'),
		Vegan: boniTexts.some(o => o === 'Vegan'),
		Vegetarian: boniTexts.some(o => o === 'vegetarisch')
	}
}
