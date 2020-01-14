import * as childProcess from 'child_process'
import {promisify} from 'util'

const exec = promisify(childProcess.exec)

export async function run(script: string, ...params: string[]): Promise<{stdout: string; stderr: string}> {
	let commandline = 'nice gnuplot '
	if (params.length > 0) {
		commandline += '-e "'
		commandline += params.join(';')

		commandline += '" '
	}

	commandline += script

	return exec(commandline)
}
