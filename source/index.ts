import {Canteen} from './canteen'
import {loadCanteens, loadMealsOfCanteenCurrentlyKnown} from './crawler'
import {saveCanteenMealFiles} from './fs'
import {serialPromise} from './serial-promise'
import * as git from './git'

async function doit(): Promise<void> {
	await git.init()
	const canteens = await loadCanteens()
	await serialPromise(
		async (canteen: Canteen) => saveCanteenMealFiles(canteen.name, await loadMealsOfCanteenCurrentlyKnown(canteen)),
		canteens
	)
	await git.commitAndPush()
}

doit()

if (process.env.NODE_ENV === 'production') {
	// Every 70 minutes
	setInterval(doit, 1000 * 60 * 70)
}
