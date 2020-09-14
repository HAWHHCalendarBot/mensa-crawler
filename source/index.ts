import {Canteen} from './canteen'
import {loadCanteens, loadMealsOfCanteenCurrentlyKnown} from './crawler'
import {saveCanteenMealFiles} from './fs'
import {serialPromise} from './serial-promise'
import * as git from './git'

process.title = 'mensa-crawler'

async function doit(): Promise<void> {
	console.time('doit')
	await git.init()
	const canteens = await loadCanteens()
	await serialPromise(
		async (canteen: Canteen) => saveCanteenMealFiles(canteen.name, await loadMealsOfCanteenCurrentlyKnown(canteen)),
		canteens
	)
	await git.commitAndPush()
	console.timeEnd('doit')
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
doit()

if (process.env.NODE_ENV === 'production') {
	// Every 70 minutes
	setInterval(doit, 1000 * 60 * 70)
}
