// Adapted from https://github.com/Knutakir/week-number/blob/master/index.js

const SECOND_IN_MS = 1000
const MINUTE_IN_MS = 60 * SECOND_IN_MS
const HOUR_IN_MS = 60 * MINUTE_IN_MS
const DAY_IN_MS = 24 * HOUR_IN_MS

const DAYS_IN_A_WEEK = 7

export function weekNumber(date: Readonly<Date>): number {
	const firstDayOfWeek = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))

	// The first week in the ISO definition starts with a week containing thursday.
	// This means we add 4 (thursday) and minus the current day of the week (UTC day || 7 (if UTC day is 0, which is sunday)) to the current UTC date
	firstDayOfWeek.setUTCDate(firstDayOfWeek.getUTCDate() + 4 - (firstDayOfWeek.getUTCDay() || DAYS_IN_A_WEEK))

	const firstDayOfYear = new Date(Date.UTC(firstDayOfWeek.getUTCFullYear(), 0, 1))
	const timeDifference = firstDayOfWeek.getTime() - firstDayOfYear.getTime()
	const daysDifference = timeDifference / DAY_IN_MS

	return Math.ceil(daysDifference / DAYS_IN_A_WEEK)
}
