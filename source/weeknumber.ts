// Adapted from https://github.com/Knutakir/week-number/blob/master/index.js

const millisecondsInDay = 86400000 // 1000ms * 60s * 60m * 24h
const daysInWeek = 7

export function weekNumber(date: Date): number {
	const firstDayOfWeek = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))

	// The first week in the ISO definition starts with a week containing thursday.
	// This means we add 4 (thursday) and minus the current day of the week (UTC day || 7 (if UTC day is 0, which is sunday)) to the current UTC date
	firstDayOfWeek.setUTCDate(firstDayOfWeek.getUTCDate() + 4 - (firstDayOfWeek.getUTCDay() || daysInWeek))

	const firstDayOfYear = new Date(Date.UTC(firstDayOfWeek.getUTCFullYear(), 0, 1))
	const timeDifference = firstDayOfWeek.getTime() - firstDayOfYear.getTime()
	const daysDifference = timeDifference / millisecondsInDay

	return Math.ceil(daysDifference / daysInWeek)
}
