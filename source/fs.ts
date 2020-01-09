import {promises as fsPromises} from 'fs'

import arrayReduceGroupBy from 'array-reduce-group-by'
import stringify from 'json-stable-stringify'

import {Meal} from './meal'

export async function saveCanteenMealFiles(canteenName: string, meals: readonly Meal[]): Promise<void> {
	const groupedByDay = meals.reduce(arrayReduceGroupBy<string, Meal>(o => dayFilenamePart(o.Date)), {})

	const path = `meals/${canteenName}`
	await fsPromises.mkdir(path, {recursive: true})

	await Promise.all(
		Object.keys(groupedByDay)
			.map(async day => writeJson(
				`${path}/${day}.json`,
				groupedByDay[day]
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

export async function writeJson(file: string, content: unknown): Promise<void> {
	await fsPromises.writeFile(
		file,
		stringify(content, {space: '\t'}) + '\n'
	)
}
