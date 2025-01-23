import {writable} from "svelte/store"

export const canteenStore = writable(null)

export const canteenFetch = async () => {
    try {
        const response = await fetch(import.meta.env.VITE_API + "/api/canteen", {
            credentials: "include"
        })
        const data = await response.json()
        canteenStore.set(data["data"])
    } catch {
        // fail quietly
    }
}