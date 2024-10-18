import {writable} from "svelte/store"

export const timetableStore = writable(null)
export const timetablePermanentStore = writable(null)

export const timetableGroups = [
    {"id": "ZGY21K", "name": "R3-EM3-OV4", "class": "R3", "src": "sa"},
    {"id": "RGW1X6", "name": "R3-EM1-OV2", "class": "R3", "src": "af"}
]
export const timetableGroupStore = writable(null)

export const timetableFetch = async (group, page) => {

    // generate current week string for cache safety
    const time = new Date()
    const timeNow = new Date(new Date().setDate(time.getDate() - time.getDay() + 1))
    const timeFallback = new Date(new Date().setDate(timeNow.getDate() - 7))

    let v = encodeURIComponent(btoa(timeNow.getDate().toString() + "/" + (time.getMonth() + 1).toString() + "/" + time.getFullYear().toString()))

    if (time.getDate() < timeNow.getDate()) {
        v = encodeURIComponent(btoa(timeFallback.getDate().toString() + "/" + (timeFallback.getMonth() + 1).toString() + "/" + timeFallback.getFullYear().toString()))
    }

    // do the actual request
    const response = await fetch(import.meta.env.VITE_API + "/api/bakalari/timetable?group=" + group + "&page=" + page.toString() + "&v=" + v.toString(), {
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