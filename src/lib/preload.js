import {timetableCountdownStore, timetableFetch, timetablePermanentFetch, timetablePermanentStore, timetableStore} from "./timetable.js"
import {canteenFetch, canteenStore} from "./canteen.js"

export const preload = (group) => {
    timetablePermanentStore.set(null)
    timetableCountdownStore.set(null)
    timetableStore.set(null)
    canteenStore.set(null)

    timetablePermanentFetch(group).then()
    timetableFetch(group, 0, "countdown").then()
    timetableFetch(group, 0, "timetable").then()
    canteenFetch().then()
}