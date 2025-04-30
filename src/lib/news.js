import {writable} from "svelte/store"

export const newsStore = writable(null)

export const newsFetch = async (school) => {
	try {
		const response = await fetch(import.meta.env.VITE_API + "/api/news?school=" + school, {
			credentials: "include"
		})
		const data = await response.json()
		newsStore.set(data["data"])
	} catch {
		// fail quietly
	}
}