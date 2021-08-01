import got, {Response} from 'got'

export async function request(url: string): Promise<Response<string>> {
	const response = await got(url, {
		headers: {
			'user-agent': 'hawhh mensa-crawler (https://github.com/HAWHHCalendarBot/mensa-crawler)',
		},
	})

	return response
}
