import {writable} from "svelte/store"
import {overrideOV, overrideOVGroup} from "./override.js"
import {getWeek} from "./helper.js"

export const timetableStore = writable(null)
export const timetablePageStore = writable(0)
export const timetablePermanentStore = writable(null)
export const timetableCountdownStore = writable(null)

export const timetableFetch = async (group, page, override) => {
    try {
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

        if (!data["data"]) {
            return
        }

        switch (override) {
            case "countdown":
                if (data["data"]["Days"][time.getDay() - 1] && data["data"]["Days"][time.getDay() - 1]["Atoms"][0]?.["SubjectId"] === "67") {
                    let edit = data["data"]
                    let teacher = edit["Days"][time.getDay() - 1]["Atoms"][0]?.["TeacherId"] ?? "#"

                    edit["Days"][time.getDay() - 1]["Atoms"] = overrideOV["Atoms"]
                    edit["Hours"] = overrideOV["Hours"]

                    for (const atom of edit["Days"][time.getDay() - 1]["Atoms"]) {
                        atom["TeacherId"] = teacher
                    }

                    data["data"] = edit
                }
            case "timetable":
                let edit = data["data"]
                let week = getWeek(new Date(new Date().setDate((time.getDate() - time.getDay() + 5) + page * 7)))
                let ov = overrideOVGroup[group][(week) % 2 === 0 ? 1 : 0]

                if (time.getDay() === 0) {
                    ov = overrideOVGroup[group][(week) % 2 === 0 ? 0 : 1] // swap week polarity. could be week-- but it would break on new year eve
                }

                for (let i = 0; i < 5; i++) {
                    if (!edit["Days"][i]["Atoms"]) { // check if day exists in bakalaři
                        continue
                    }

                    let h7 = null
                    let h8 = null

                    for (let j = 0; j < edit["Days"][i]["Atoms"].length; j++) {
                        if (ov[i] && edit["Days"][i]["Atoms"][j]["SubjectId"] === "67") { // check if atom is OV and exist in override
                            edit["Days"][i]["Atoms"][j]["TeacherId"] = ov[i]
                            continue
                        }

                        // move 9th and 8th hour so its starts from 7th
                        switch (edit["Days"][i]["Atoms"][j]["HourId"]) {
                            case 9:
                                h7 = j
                                break
                            case 10:
                                h8 = j
                                break
                            case 11:
                                if (h7 === null) {
                                    edit["Days"][i]["Atoms"][h8]["HourId"]--
                                    edit["Days"][i]["Atoms"][h8]["LessonRelease"] = "override"
                                    edit["Days"][i]["Atoms"][j]["HourId"]--
                                    edit["Days"][i]["Atoms"][j]["LessonRelease"] = "override"
                                }
                                break
                        }
                    }
                }

                data["data"] = edit
        }


        switch (override) {
            case "countdown":
                timetableCountdownStore.set(data["data"])
                return
            case "timetable":
                timetablePageStore.set(page)
                timetableStore.set(data["data"])
                return
        }
    } catch {
        // fail quietly
    }
}

export const timetablePermanentFetch = async (group) => {
    try {
        const response = await fetch(import.meta.env.VITE_API + "/api/bakalari/timetable-permanent?group=" + group.toString(), {
            credentials: "include"
        })
        const data = await response.json()
        timetablePermanentStore.set(data["data"])
    } catch {
        // fail quietly
    }
}