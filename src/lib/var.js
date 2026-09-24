import { writable } from "svelte/store"

export const source = {
	"gymnp.cz": [
		{
			id: "764",
			name: "SEPTIMA",
			class: "SEPTIMA",
			src: "am",
		},
	],
	"sssenp.cz": [
		{
			id: "ZGW1X6",
			name: "R4-ALEŠ",
			class: "R4",
			src: "af",
		}
	],
}

export const sourceSchoolStore = writable(null)
export const sourceGroupStore = writable(null)
