import {writable} from "svelte/store"

export const timetableStore = writable(null)
export const timetablePermanentStore = writable(null)

export const timetableFetch = async () => {
    const response = await fetch(import.meta.env.VITE_API + "/api/bakalari/timetable?page=0", {
        credentials: "include"
    })
    const data = await response.json()
    timetableStore.set(data["data"])
}

export const timetablePermanentFetch = async () => {
    const response = await fetch(import.meta.env.VITE_API + "/api/bakalari/timetable-permanent", {
        credentials: "include"
    })
    const data = await response.json()
    timetablePermanentStore.set(data["data"])
}