<script>
	import {onDestroy, onMount} from "svelte"
	import Banner from "../components/Banner.svelte"
	import Loading from "../components/Loading.svelte"
	import {cOffline, cRefresh} from "../lib/const.js"
	import {formatAddZero, formatTime} from "../lib/format.js"
	import {getWeek} from "../lib/helper.js"
	import {overrideMasters, overrideRooms, overrideWeek} from "../lib/override.js"
	import {timetableCountdownStore, timetableFetch, timetablePermanentStore} from "../lib/timetable.js"
	import {source, sourceGroupStore, sourceSchoolStore} from "../lib/var.js"
	import {update} from "../main.js"

	let animate = $state(false)
	let time = $state(new Date())

	// svelte-ignore state_referenced_locally
	let refresh = time.getTime() + cOffline // cOffline run is set always for the next request after the data is already loaded anyway
	let interval

	/*const getD = end => Math.ceil((end - time) / 1000 / 3600 / 24).toString()
    let hourD = $derived(getD(1756677600000))*/
	const getH = hour => formatAddZero(Math.trunc((formatTime(hour).getTime() - time) / 1000 / 3600).toString())
	const getM = hour => formatAddZero(Math.trunc((((formatTime(hour).getTime() - time) / 1000) % 3600) / 60).toString())
	const getS = hour => formatAddZero(Math.trunc(((formatTime(hour).getTime() - time) / 1000) % 60).toString())

	onMount(async () => {
		setTimeout(async () => {
			animate = true
		}, 500) // yeah, it's stupid but if it works who cares, it's just an animation

		if (interval) clearInterval(interval)
		interval = setInterval(() => {
			time = new Date()

			if (time.getTime() > refresh) {
				timetableFetch($sourceGroupStore, 0, "countdown")
				if (!$timetableCountdownStore) {
					refresh = time.getTime() + cOffline
				} else {
					refresh = time.getTime() + cRefresh
				}
			}
		}, 1000)
	})

	onDestroy(() => {
		animate = false
		clearInterval(interval)
	})
</script>

{#if $timetableCountdownStore && $timetablePermanentStore && $timetablePermanentStore["Hours"]}
	{@const today = $timetableCountdownStore["Days"]?.[time.getDay() - 1] ?? null}
	{@const atomBegin = today ? today?.["Atoms"].find(s => s["SubjectId"]) : null}

	{@const hour = $timetableCountdownStore["Hours"].find(t => {
		let hourBegin = formatTime(t["BeginTime"])
		let hourEnd = formatTime(t["EndTime"])
		return time - hourBegin >= 0 && hourEnd - time >= 0 && today?.["Atoms"].find(s => s["HourId"] === t["Id"] && s["SubjectId"]) // check if current hour has atom else use hourNext
	})}
	{@const hourNext = $timetableCountdownStore["Hours"].find(t => {
		let hourBegin = formatTime(t["BeginTime"])
		return hourBegin - time >= 0 && today?.["Atoms"].find(s => s["HourId"] === t["Id"] && s["SubjectId"]) && t["Id"] >= (atomBegin?.["HourId"] ?? 0)
	})}

	{@const atomOriginal = $timetablePermanentStore["Days"][time.getDay() - 1]?.["Atoms"].find(t => {
		return t["HourId"] === (hour?.["Id"] ?? "#") && t["CycleIds"]?.includes($timetableCountdownStore["Cycles"][0]?.["Id"] ?? overrideWeek(getWeek(time)))
	})}
	{@const atomOriginalNext = $timetablePermanentStore["Days"][time.getDay() - 1]?.["Atoms"].find(t => {
		return t["HourId"] === (hourNext?.["Id"] ?? "#") && t["CycleIds"]?.includes($timetableCountdownStore["Cycles"][0]?.["Id"] ?? overrideWeek(getWeek(time)))
	})}

	{@const atom = today?.["Atoms"].find(t => t["HourId"] === (hour?.["Id"] ?? "#") && (t["Change"] === null || t["SubjectId"] !== (atomOriginal?.["SubjectId"] ?? "#") || t["TeacherId"] !== (atomOriginal?.["TeacherId"] ?? "#") || t["RoomId"] !== (atomOriginal?.["RoomId"] ?? "#"))) ?? null}
	{@const atomNext = today?.["Atoms"].find(t => t["HourId"] === (hourNext?.["Id"] ?? "#") && (t["Change"] === null || t["SubjectId"] !== (atomOriginalNext?.["SubjectId"] ?? "#") || t["TeacherId"] !== (atomOriginalNext?.["TeacherId"] ?? "#") || t["RoomId"] !== (atomOriginal?.["RoomId"] ?? "#"))) ?? null}

	{@const subject = $timetableCountdownStore["Subjects"].find(s => s["Id"] === (atom?.["SubjectId"] ?? (atomNext?.["SubjectId"] ?? "#")))?.["Abbrev"].toUpperCase() ?? "#"}
	{@const subjectName = $timetableCountdownStore["Subjects"].find(s => s["Id"] === (atom?.["SubjectId"] ?? (atomNext?.["SubjectId"] ?? "#")))?.["Name"] ?? ""}
	{@const teacher = $timetablePermanentStore["Teachers"].find(s => s["Id"] === (atom?.["TeacherId"] ?? (atomNext?.["TeacherId"] ?? "#")))?.["Name"] ?? $timetableCountdownStore["Teachers"].find(s => s["Id"] === (atom?.["TeacherId"] ?? (atomNext?.["TeacherId"] ?? "#")))?.["Name"] ?? ""}

	{@const room = $timetableCountdownStore["Rooms"].find(s => s["Id"] === (atom?.["RoomId"] ?? (atomNext?.["RoomId"] ?? "#")))?.["Abbrev"] ?? ""}
	{@const roomOverride = overrideRooms?.[$sourceGroupStore]}

	{@const hourH = hour ? getH(hour["EndTime"]) : getH(hourNext?.["BeginTime"] ?? "00")}
	{@const hourM = hour ? getM(hour["EndTime"]) : getM(hourNext?.["BeginTime"] ?? "00")}
	{@const hourS = hour ? getS(hour["EndTime"]) : getS(hourNext?.["BeginTime"] ?? "00")}

	<!--<Winter />-->
	<!--<Summer />-->
	<div id="countdown-block">
		<div id="countdown-header">
			<Banner />
		</div>
		<!-- Days countdown
		<div id="countdown-center">
            <div id="countdown-clock" data-animate={animate}>
                {#key hourD}
                    <h1 style="will-change: transform">{hourD}</h1>
                {/key}
            </div>
            <h2 style="color: var(&#45;&#45;silver)">days</h2>
        </div>-->
		<div id="countdown-center">
			<div id="countdown-clock" data-animate={animate}>
				{#if subject !== "#" && hourH !== "00"}
					{#key hourH}
						<h1 style="will-change: transform">{hourH}</h1>
					{/key}
					<h1 class="countdown-clock-colon">:</h1>
				{/if}
				{#if subject !== "#"}
					{#key hourM}
						<h1 style="will-change: transform">{hourM}</h1>
					{/key}
				{:else}
					<h1>00</h1>
				{/if}
				<h1 class="countdown-clock-colon">:</h1>
				{#if subject !== "#"}
					{#key hourS}
						<h1 style="will-change: transform">{hourS}</h1>
					{/key}
				{:else}
					<h1>00</h1>
				{/if}
			</div>
			{#if !hour && subject !== "#"}
				{#if hourNext?.["Id"] === atomBegin?.["HourId"]}
					<h2 style="color: var(--snow)">starting with</h2>
				{:else}
					<h2 style="color: var(--snow)">break followed by</h2>
				{/if}
			{/if}
			<div id="countdown-subject" style:color={subject !== "#" ? (subjectName !== "" ? "var(--subject-" + subject + ")" : "transparent") : "var(--subject-NON)"} style={subjectName !== "" ? "" : "background:var(--brand);background-clip:text"}>
				{#if subject !== "#"}
					<h2>{"#" + (hour?.["Caption"] ?? hourNext["Caption"])}</h2>
					<h2>-</h2>
				{/if}
				<h2>{subject !== "#" ? subject : "painless"}</h2>
				{#if subject !== "#"}
					{#if room !== ""}
						<h2>-</h2>
						<h2>{room}</h2>
					{:else if subject.toUpperCase() === "OV"}
						<h2>-</h2>
						<h2>{overrideMasters?.[atom?.["TeacherId"] ?? atomNext?.["TeacherId"]] ?? "#"}</h2>
					{:else if roomOverride && !isNaN(Number(hour?.["Caption"] ?? hourNext["Caption"]))}
						<h2>-</h2>
						<h2>{roomOverride["rooms"][($timetableCountdownStore["Cycles"][0]?.["Id"] ?? overrideWeek(getWeek(time))) === "2" ? 1 : 0][time.getDay() - 1]?.[Number(hour?.["Caption"] ?? hourNext["Caption"])]}</h2>
					{/if}
				{/if}
			</div>
			{#if subject !== "#"}
				<h4 style="color: var(--silver)">{teacher}</h4>
			{/if}
			<!--DEBUG
            <span>{subject}</span>
            <span>{"HOUR - " +hour?.["Caption"] + " - " + atom?.["SubjectId"]}</span>
            <span>{"NEXT - " +hourNext?.["Caption"] + " - " + atomNext?.["SubjectId"]}</span>-->
		</div>
		<div id="countdown-footer">
			<div>
				<h4>Created by</h4>
				<a href="https://qery.cz">Štěpán Aubrecht</a>
			</div>
			<div style="text-align: right">
				<!--injected variable by cloudflare-->
				<h4>build: {(__CF_PAGES_COMMIT_SHA__ ? ("#" + __CF_PAGES_COMMIT_SHA__.slice(0, 7)) : "dev") + ($update ? "*" : "")}</h4>
				<h4>group: {source[$sourceSchoolStore.toString()].find(g => g["id"] === $sourceGroupStore)?.["name"]}</h4>
			</div>
		</div>
	</div>
{:else}
	<Loading />
{/if}

<style>
	#countdown-block {
		display: flex;
		height: 100%;
		width: 100%;
		flex-direction: column;
		justify-content: space-between;
		z-index: 5;

		--header: 88px;
		--footer: 56px;
	}

	#countdown-center, #countdown-footer {
		z-index: 10;
	}

	#countdown-center {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 10px;
		overflow: hidden;
		margin-bottom: calc(var(--header) - var(--footer));
	}

	#countdown-clock {
		display: flex;
		justify-content: center;
	}

	#countdown-clock * {
		animation: var(--animation-scale);
		animation-duration: 0s;
		user-select: none;
		font-family: RobotoMono, monospace;
	}

	/*i dont want to talk about this xd*/
	.countdown-clock-colon {
		color: var(--silver);
		font-size: 60px;
		line-height: 60px;
		min-height: 60px;
		letter-spacing: -5px;
		text-indent: -6px;
	}

	#countdown-clock[data-animate="true"] * {
		animation-duration: 50ms !important;
	}

	#countdown-subject {
		display: flex;
		justify-content: center;
		gap: 5px;
	}

	#countdown-subject *:first-child {
		text-align: right;
	}

	#countdown-subject *:last-child {
		text-align: left;
	}

	#countdown-subject * {
		color: inherit;
		margin: auto 0;
	}

	#countdown-header {
		height: var(--header);
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		padding: 10px;
		display: block;
		/*animation: hide 1s 5s normal both;*/
	}

	#countdown-footer {
		display: flex;
		padding: 10px;
		height: var(--footer);
		align-items: end;
		justify-content: space-between;
	}

	#countdown-footer div {
		height: 36px;
		display: flex;
		flex-direction: column;
	}

	#countdown-footer h4, #countdown-footer a {
		display: inline-block;
		text-decoration: none;
		color: var(--snow);
	}

	#countdown-footer a {
		font-size: 15px;
		line-height: 18px;
		background: var(--brand);
		color: transparent;
		background-clip: text;
	}

	@keyframes hide {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(-150%);
		}
	}
</style>
