/* eslint no-await-in-loop: off */
export async function serialPromise<Arg, Result>(func: (arg: Arg) => Promise<Result>, args: readonly Arg[]): Promise<Result[]> {
	const results: Result[] = []
	for (const o of args) {
		results.push(await func(o))
	}

	return results
}
