export interface Canteen {
	id: number;
	name: string;
}

export function canteenWeekUrl(id: number, year: number, week: number): string {
	return `http://speiseplan.studierendenwerk-hamburg.de/de/${id}/${year}/${week}/`
}
