import {exec} from 'child_process'
import {promisify} from 'util'
import {existsSync} from 'fs'

const run = promisify(exec)

export async function init(): Promise<void> {
	const result = existsSync('meals') ?
		await gitCommand('pull') :
		await run('git clone git@github.com:HAWHHCalendarBot/mensa-data.git meals')

	console.log('init git', result)
}

export async function commitAndPush(): Promise<void> {
	await gitCommand('add -A')
	await tryCommit()

	if (process.env.NODE_ENV === 'production') {
		const result = await gitCommand('push -u')

		if (result.stderr) {
			console.error('GIT PUSH ERROR', result.stderr)
		}

		console.log(result.stdout)
	}
}

async function gitCommand(command: string): Promise<{stdout: string; stderr: string}> {
	return run(`git -C meals ${command}`)
}

async function tryCommit(): Promise<void> {
	try {
		await gitCommand('commit -m "update" --no-gpg-sign --author "auto-update <auto-update@3t0.de>"')
	} catch (error) {
		if (error.stdout.includes('nothing to commit')) {
			// Everything is fine
			return
		}

		console.log('commit error', error.stdout)

		throw error
	}
}
