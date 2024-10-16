import {writable} from "svelte/store"

export const timetableStore = writable(null)
export const timetablePermanentStore = writable(null)

export const timetableGroups = [
    {"id": "ZGY21K", "name": "R3-EM3-OV4"},
    {"id": "RGW1X6", "name": "R3-EM1-OV2"}
]
export const timetableGroupStore = writable(null)

export const timetableFetch = async (group, page) => {
    const response = await fetch(import.meta.env.VITE_API + "/api/bakalari/timetable?group=" + group + "&page=" + page.toString(), {
        credentials: "include"
    })
    const data = await response.json()
    timetableStore.set(data["data"])
}

export const timetablePermanentFetch = async (group) => {
    const response = await fetch(import.meta.env.VITE_API + "/api/bakalari/timetable-permanent?group=" + group.toString(), {
        credentials: "include"
    })
    const data = await response.json()
    timetablePermanentStore.set(data["data"])
}