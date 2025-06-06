import { canteenFetch, canteenStore } from "./canteen.js"
import { newsFetch } from "./news.js"
import { timetableCountdownStore, timetableFetch, timetablePermanentFetch, timetablePermanentStore, timetableStore } from "./timetable.js"

export const preload = (school, group) => {
	timetablePermanentStore.set(null)
	timetableCountdownStore.set(null)
	timetableStore.set(null)
	canteenStore.set(null)

	timetablePermanentFetch(group).then()
	timetableFetch(group, 0, "countdown").then()
	timetableFetch(group, 0, "timetable").then()
	canteenFetch(school).then()
	newsFetch(school).then()
}
