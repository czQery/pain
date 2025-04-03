import {writable} from "svelte/store"

export const newsStore = writable(null)

export const newsFetch = async () => {
    try {
        const response = await fetch(import.meta.env.VITE_API + "/api/news", {
            credentials: "include"
        })
        const data = await response.json()
        newsStore.set(data["data"])
    } catch {
        // fail quietly
    }
}