import {writeFileSync} from 'fs'

import {Canteen} from './canteen.js'
import {loadCanteens, loadMealsOfCanteenCurrentlyKnown} from './crawler/index.js'
import {saveCanteenMealFiles} from './fs.js'
import {serialPromise} from './serial-promise.js'
import * as git from './git.js'

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
	writeFileSync('.last-successful-run', new Date().toISOString(), 'utf8')
	console.timeEnd('doit')
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
doit()

if (process.env['NODE_ENV'] === 'production') {
	// Every 70 minutes
	setInterval(doit, 1000 * 60 * 70)
}
