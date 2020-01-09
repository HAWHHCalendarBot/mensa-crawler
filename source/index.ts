import {loadCanteens, loadMealsOfCanteenCurrentlyKnown} from './crawler'
import {saveCanteenMealFiles} from './fs'

async function doit(): Promise<void> {
	const canteens = await loadCanteens()
	await Promise.all(
		canteens.map(async canteen => saveCanteenMealFiles(canteen.name, await loadMealsOfCanteenCurrentlyKnown(canteen)))
	)
}

doit()
