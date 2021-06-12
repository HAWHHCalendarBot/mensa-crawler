import {promises as fsPromises} from 'fs'

import stringify from 'json-stable-stringify'
import arrayReduceGroupBy from 'array-reduce-group-by'

import {Meal} from './meal.js'

export async function saveCanteenMealFiles(canteenName: string, meals: readonly Meal[]): Promise<void> {
	const groupedByDay = meals.reduce(arrayReduceGroupBy<string, Meal>(o => dayFilenamePart(o.Date)), {})

	const path = `meals/${canteenName}`
	await fsPromises.mkdir(path, {recursive: true})

	await Promise.all(
		Object.entries(groupedByDay)
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			.map(async ([day, meals]) => writeJson(
				`${path}/${day}.json`,
				meals
					.sort((a, b) => `${a.Category}${a.Name}`.localeCompare(`${b.Category}${b.Name}`))
			))
	)
}

function dayFilenamePart(isoTimestring: string): string {
	const date = new Date(Date.parse(isoTimestring))
	let filename = ''
	filename += date.getUTCFullYear()
	filename += ensureTwoDigits(date.getUTCMonth() + 1)
	filename += ensureTwoDigits(date.getUTCDate())
	return filename
}

function ensureTwoDigits(input: number): string {
	if (input < 10) {
		return `0${input}`
	}

	return String(input)
}

async function writeJson(file: string, content: unknown): Promise<void> {
	await fsPromises.writeFile(
		file,
		stringify(content, {space: '\t'}) + '\n'
	)
}

export async function readMeals(canteen: string): Promise<Meal[]> {
	const path = `meals/${canteen}`
	const dir = await fsPromises.readdir(path)
	const allContents = await Promise.all(
		dir.map(async o => fsPromises.readFile(`${path}/${o}`, 'utf8'))
	)
	const allMeals = allContents
		.flatMap(o => JSON.parse(o) as Meal[])

	return allMeals
}
