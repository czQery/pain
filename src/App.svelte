<script>
	import { active, link } from "@dvcol/svelte-simple-router/action"
	import { RouterContext, RouterView } from "@dvcol/svelte-simple-router/components"
	import { LucideCalendarRange, LucideClock, LucideSettings, LucideUtensilsCrossed } from "lucide-svelte"
	import { onMount } from "svelte"
	import Winter from "./components/season/Winter.svelte"
	import { cOffline } from "./lib/const.js"
	import { preload } from "./lib/preload.js"
	import { timetablePermanentFetch, timetablePermanentStore } from "./lib/timetable.js"
	import { ttlCleanCache } from "./lib/ttl.js"
	import { umami } from "./lib/umami.js"
	import { source, sourceGroupStore, sourceSchoolStore } from "./lib/var.js"
	import Canteen from "./routes/Canteen.svelte"
	import Countdown from "./routes/Countdown.svelte"
	import Settings from "./routes/Settings.svelte"
	import Timetable from "./routes/Timetable.svelte"

	let interval

	onMount(() => {
		if (interval) clearInterval(interval)
		document.getElementById("init-loading").style.display = "none"
		document.getElementById("app").style.display = "flex"

		// init source school settings
		let school = localStorage.getItem("school")
		if (school && source[school]) {
			sourceSchoolStore.set(school)
		} else {
			sourceSchoolStore.set(Object.keys(source)[0]) // set default school
			localStorage.setItem("school", $sourceSchoolStore.toString())
		}

		// init source group settings
		let group = localStorage.getItem("group")
		if (group && source[$sourceSchoolStore.toString()].some(g => g["id"] === group)) {
			sourceGroupStore.set(group)
		} else {
			sourceGroupStore.set(source[$sourceSchoolStore.toString()][0]["id"]) // set default group
			localStorage.setItem("group", $sourceGroupStore.toString())
		}

		preload($sourceSchoolStore.toString(), $sourceGroupStore.toString())
		umami($sourceSchoolStore.toString(), $sourceGroupStore.toString())
		ttlCleanCache()

		interval = setInterval(() => {
			if (!$timetablePermanentStore) {
				timetablePermanentFetch($sourceGroupStore.toString())
			} else {
				clearInterval(interval)
			}
		}, cOffline)
	})

	const routes = [{ name: "countdown", path: "/countdown", component: Countdown }, { name: "timetable", path: "/timetable", component: Timetable }, { name: "canteen", path: "/canteen", component: Canteen }, { name: "settings", path: "/settings", component: Settings }, { name: "index", path: "*", redirect: { name: "countdown" } }]

	const options = { routes }
</script>

<RouterContext {options}>
	<Winter />
	<main class="container">
		<RouterView />
	</main>
	<footer>
		<ul>
			<li>
				<a use:link use:active href="/countdown">
					<LucideClock />
				</a>
			</li>
			<li>
				<a use:link use:active href="/timetable">
					<LucideCalendarRange />
				</a>
			</li>
			<li>
				<a use:link use:active href="/canteen">
					<LucideUtensilsCrossed />
				</a>
			</li>
			<li>
				<a use:link use:active href="/settings">
					<LucideSettings />
				</a>
			</li>
		</ul>
	</footer>
</RouterContext>

<style>
	main {
		display: flex;
		width: 100%;
		align-items: center;
		flex-direction: column;
		height: calc(100svh - 50px - var(--bar));
		overflow: hidden;
		z-index: 1;

		--subject-NON: var(--silver);

		--subject-A: #0c355b;
		--subject-F: var(--subject-A);
		--subject-AJ: #d5334b;
		--subject-KAJ: var(--subject-AJ);
		--subject-CAD: #5f6895;
		--subject-INF: var(--subject-CAD);
		--subject-PRO: var(--subject-CAD);
		--subject-ČJ: #f2c40e;
		--subject-ČJL: var(--subject-ČJ);
		--subject-ČT: #dd7571;
		--subject-HV: var(--subject-ČT);
		--subject-E: #058e3f;
		--subject-G: var(--subject-E);
		--subject-EM: #a845b3;
		--subject-CH: var(--subject-EM);
		--subject-ET: #11bb41;
		--subject-B: var(--subject-ET);
		--subject-EK: #fa147f;
		--subject-ZSV: var(--subject-EK);
		--subject-M: #23b1d2;
		--subject-MVE: var(--subject-M);
		--subject-ON: #851049;
		--subject-NJ: var(--subject-ON);
		--subject-OV: #885d4c;
		--subject-D: var(--subject-OV);
		--subject-VV: #ff7629;
		--subject-TV: #f5980c;
	}

	footer {
		height: 50px;
		width: 100%;
		user-select: none;
		box-shadow: 0 -1px 0 var(--gray);
		z-index: 20;
		background-color: var(--black);
		view-transition-name: footer;
	}

	footer ul {
		display: flex;
		margin: 0;
		padding: 0;
		height: 100%;
		justify-content: center;
		list-style-type: none;
		text-decoration: none;
	}

	footer :global(a) {
		text-decoration: none;
		-webkit-tap-highlight-color: transparent !important;
		outline: none !important;
		display: flex;
		justify-content: center;
		width: inherit;
	}

	footer :global(svg) {
		height: 24px;
		stroke: var(--white);
		margin: 13px 0;
		display: block;
	}

	footer :global(a[data-active="true"] svg) {
		stroke: var(--purple);
	}

	footer :global(a:active svg) {
		animation: var(--animation-scale);
	}

	footer ul li {
		width: 100%;
		max-width: 200px;
	}
</style>
