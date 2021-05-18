import {exec} from 'child_process'
import {promisify} from 'util'
import {existsSync} from 'fs'

const run = promisify(exec)

export async function init(): Promise<void> {
	const result = existsSync('meals/.git') ?
		await gitCommand('pull') :
		await run('git clone -q --depth 1 git@github.com:HAWHHCalendarBot/mensa-data.git meals')

	console.log('git init', result)
}

export async function commitAndPush(): Promise<void> {
	await gitCommand('add -A')
	await tryCommit()

	if (process.env['NODE_ENV'] === 'production') {
		const result = await gitCommand('push -u')
		console.log('git push', result)
	}
}

async function gitCommand(command: string): Promise<{stdout: string; stderr: string}> {
	return run(`git -C meals ${command}`)
}

async function tryCommit(): Promise<void> {
	try {
		await gitCommand('commit -m "update" --no-gpg-sign --author "mensa-crawler <hawhh-mensa-crawler@3t0.de>"')
	} catch (error: unknown) {
		if (typeof error === 'object' && error !== null && 'stdout' in error) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const {stdout} = error as any
			if (typeof stdout === 'string') {
				if (stdout.includes('nothing to commit')) {
					// Everything is fine
					return
				}

				console.error('git commit error', stdout)
			}
		}

		throw error
	}
}
