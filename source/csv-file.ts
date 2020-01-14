import {promises as fsPromises} from 'fs'

function parseCsvToFileContent(header: readonly string[], csvLines: readonly string[]): string {
	const headerLine = header.join(', ')
	const lines = [headerLine, ...csvLines]
	const content = lines.join('\n') + '\n'
	return content
}

export async function writeCsvFile(filename: string, header: readonly string[], csvLines: readonly string[]): Promise<void> {
	const content = parseCsvToFileContent(header, csvLines)
	return fsPromises.writeFile(filename, content, 'utf8')
}
