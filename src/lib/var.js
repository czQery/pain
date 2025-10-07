import {writable} from "svelte/store"

export const source = {
	"gymnp.cz": [
		{
			id: "764",
			name: "SEXTA",
			class: "SEXTA",
			src: "am",
		},
	],
	"sssenp.cz": [
		{
			id: "ZGY21K",
			name: "R4-ŠTĚPÁN",
			class: "R4",
			src: "sa",
		},
		{
			id: "RGW1X6",
			name: "R4-ALEŠ",
			class: "R4",
			src: "af",
		},
		{
			id: "ZGW1WS",
			name: "R4-DANIEL",
			class: "R4",
			src: "dk",
		},
	],
}

export const sourceSchoolStore = writable(null)
export const sourceGroupStore = writable(null)
