export async function serialPromise<Arg, Result>(func: (arg: Arg) => Promise<Result>, args: readonly Arg[]): Promise<Result[]> {
	const results: Result[] = []
	for (const o of args) {
		// eslint-disable-next-line no-await-in-loop
		results.push(await func(o))
	}

	return results
}
