import {aAttempts, cOffline} from "./const.js"

export const umami = (school, group) => {
	let attempts = 0
	let interval = setInterval(async () => {
		if (attempts + 1 === aAttempts) {
			clearInterval(interval)
			return
		}

		if (window.umami) {
			await window.umami.identify({school: school, group: group})
			clearInterval(interval)
			return
		}

		attempts++
	}, cOffline)
}