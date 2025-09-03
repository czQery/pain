import {writable} from "svelte/store"

export const source = {
	"gymnp.cz": [{ id: "764", name: "SEXTA", class: "SEXTA", src: "am" }],
	"sssenp.cz": [{ id: "ZGY21K", name: "R4-OV1-A1-EM1", class: "R4", src: "sa" }, { id: "RGW1X6", name: "R4-OV2-A1-EM1", class: "R4", src: "af" }, {
		id: "ZGW1WS",
		name: "R4-OV3-A2-EM2",
		class: "R4",
		src: "dk",
	}],
}

export const sourceSchoolStore = writable(null)
export const sourceGroupStore = writable(null)
