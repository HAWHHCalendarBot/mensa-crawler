import * as git from './git'
import {doGraph} from './graph-stuff'

async function doit(): Promise<void> {
	console.time('doit')
	await git.init()
	console.timeEnd('doit')

	console.time('graph')
	await doGraph()
	console.timeEnd('graph')
}

doit()

if (process.env.NODE_ENV === 'production') {
	// Every 70 minutes
	setInterval(doit, 1000 * 60 * 70)
}
