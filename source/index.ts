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
