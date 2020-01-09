import {Canteen} from './canteen'
import {loadCanteens, loadMealsOfCanteenCurrentlyKnown} from './crawler'
import {saveCanteenMealFiles} from './fs'
import {serialPromise} from './serial-promise'

async function doit(): Promise<void> {
	const canteens = await loadCanteens()
	await serialPromise(
		async (canteen: Canteen) => saveCanteenMealFiles(canteen.name, await loadMealsOfCanteenCurrentlyKnown(canteen)),
		canteens
	)
}

doit()
