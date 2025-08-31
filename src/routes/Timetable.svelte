<script>
	import { LucideArrowBigLeftDash, LucideArrowBigRightDash, LucideCookingPot, LucideMessageSquareText, LucidePencil, LucideTriangleAlert } from "lucide-svelte"
	import { onDestroy, onMount } from "svelte"
	import Loading from "../components/Loading.svelte"
	import Modal from "../components/Modal.svelte"
	import { canteenStore } from "../lib/canteen.js"
	import { cOffline, cRefresh } from "../lib/const.js"
	import { formatCapitalize, formatOrdinalNumber, formatTime } from "../lib/format.js"
	import { getWeek } from "../lib/helper.js"
	import { overrideMasters, overrideOV, overrideRooms, overrideWeek } from "../lib/override.js"
	import { timetableFetch, timetablePageStore, timetablePermanentStore, timetableStore } from "../lib/timetable.js"
	import { source, sourceGroupStore, sourceSchoolStore } from "../lib/var.js"

	const hours = 9 // 0-8
	// const hours = 10 // 0-9
	const subjectChange = " > "
	const days = ["MON", "TUE", "WED", "THU", "FRI"]

	let modal = $state()
	let modalSubject = $state("#")
	let modalSubjectColor = $state("NON")
	let modalTeacher = $state("#")
	let modalTheme = $state("#")
	const modalShow = (subject, teacher, description) => {
		if (subject["Name"]) {
			modalSubject = subject["Name"]
			modalSubjectColor = subject["Abbrev"].toUpperCase()
		} else {
			modalSubject = subject
			modalSubjectColor = "FREE"
		}
		if (teacher) {
			modalTeacher = teacher["Name"]
		} else {
			modalTeacher = ""
		}
		modalTheme = formatCapitalize(description.replaceAll("&quot;", "\""))
		modal.show()
		return null
	}

	const getNewTime = () => {
		let now = new Date()
		if (now.getDay() === 0) {
			now = new Date(now.setDate(now.getDate() - 1))
		}
		return now
	}

	const getNewDateTime = offset => {
		let now = getNewTime()
		let date = new Date(new Date().setDate((now.getDate() - now.getDay() + offset) + $timetablePageStore * 7))
		date.setUTCHours(0, 0, 0, 0)
		return date
	}

	let time = $state(getNewTime())

	// svelte-ignore state_referenced_locally
	let refresh = time.getTime() + cOffline // cOffline run is set always for the next request after the data is already loaded anyway
	let interval

	let windowHeight = $state(0)
	let cornerHeight = $state(0)
	const navHeight = 40
	const footerHeight = 50

	const maxPage = 6 - 1

	const setPage = async a => {
		let page = $timetablePageStore

		switch (a) {
			case "backward":
				--page
				break
			case "forward":
				++page
				break
		}

		timetableStore.set(null)
		refresh = time.getTime() + cOffline
		await timetableFetch($sourceGroupStore, page, "timetable")
	}

	onMount(async () => {
		if (interval) clearInterval(interval)
		interval = setInterval(async () => {
			time = getNewTime()

			if (time.getTime() > refresh) {
				timetableFetch($sourceGroupStore, $timetablePageStore, "timetable").then()
				if (!$timetableStore) {
					refresh = time.getTime() + cOffline
				} else {
					refresh = time.getTime() + cRefresh
				}
			}
		}, 1000)
	})

	onDestroy(() => {
		clearInterval(interval)
	})
</script>

<svelte:window bind:innerHeight={windowHeight} />
{#if $timetablePermanentStore && $timetablePermanentStore["Hours"]}
	<nav>
		<button onclick={() => setPage("backward")} disabled={$timetablePageStore === 0 || !$timetableStore}>
			<LucideArrowBigLeftDash />
		</button>
		{#if $timetablePageStore === 0}
			<h3 style="width: 125px; text-align: center">{time.toLocaleString("en-us", { month: "short" }) + " " + time.getFullYear()}</h3>
		{:else}
			{@const pageTime = getNewDateTime(1)}
			<h3 style="width: 125px; text-align: center">{pageTime.toLocaleString("en-us", { month: "short" }) + " " + pageTime.getFullYear()}</h3>
		{/if}
		<button onclick={() => setPage("forward")} disabled={$timetablePageStore === maxPage || !$timetableStore}>
			<LucideArrowBigRightDash />
		</button>
	</nav>
{/if}
{#if $timetableStore && $timetablePermanentStore && $timetablePermanentStore["Hours"]}
	{@const pageWeek = getWeek(getNewDateTime(5))}
	<Modal bind:modal title="Tuition details">
		{#if modalSubjectColor === "FREE"}
			<h2 style="background: var(--brand); color: transparent; background-clip: text">{modalSubject}</h2>
		{:else}
			<h2 style="color: var(--subject-{modalSubjectColor})">{modalSubject}</h2>
		{/if}
		{#if modalTeacher !== ""}
			<h3 style="color: var(--snow)">{modalTeacher}</h3>
		{/if}
		{#if modalTheme !== ""}
			<div style="height: 0"></div>
			<h4 style="color: var(--silver); white-space: pre-line">{modalTheme}</h4>
		{/if}
	</Modal>
	<table>
		<thead>
			<tr>
				<th class="slim" bind:offsetHeight={cornerHeight}>
					<h3>{(!isNaN($timetableStore["Cycles"][0]?.["Id"] ?? "#") ? $timetableStore["Cycles"][0]?.["Id"] : overrideWeek(pageWeek)) === "2" ? "EVEN" : "ODD"}</h3>
					<span>{formatOrdinalNumber(pageWeek) + " week"}</span>
				</th>
				{#each days as day, i}
					<th>
						<h3>{day}</h3>
						<span>{getNewDateTime(i + 1).getDate() + ". " + (getNewDateTime(i + 1).getMonth() + 1) + "."}</span>
						{#if $canteenStore}
							{@const dish = $canteenStore.find(s => s["date"] === getNewDateTime(i + 1).getTime())}
							{#if dish && !dish["open"]}
								<span class="day-canteen">
									<span class="day-canteen-shape"></span>
									<LucideCookingPot />
								</span>
							{/if}
						{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each $timetableStore["Hours"].slice(0, hours) as hour, i}
				{@const atomHeight = Math.round((((Math.max(windowHeight, 660) - footerHeight - navHeight - (cornerHeight + 1)) / hours) + Number.EPSILON) * 10) / 10}
				<!--round the number because different browsers use different precision - the epsilon trick is not perfect but whatever -->
				<tr style:height={atomHeight + "px"}>
					<th class="slim">
						<h2>{hour["Caption"]}</h2>
						<span>{hour["BeginTime"] + "-" + hour["EndTime"]}</span>
					</th>
					{#each Array(5) as _, j}
						{@const day = $timetableStore["Days"][j]}
						<!--check if day is in past or day is today but the hour is in the past-->
						{@const past = ((0 === time.getDay() || j + 1 < time.getDay() || (j + 1 === time.getDay() && time.getTime() > formatTime(hour["EndTime"]).getTime() - 1)) && $timetablePageStore === 0) ? "subject-past" : ""}
						{@const atomOriginal = $timetablePermanentStore["Days"][j]["Atoms"].find(t => t["HourId"] === hour["Id"] && t["CycleIds"]?.includes($timetableStore["Cycles"][0]?.["Id"] ?? overrideWeek(pageWeek)))}
						{@const subjectOriginal = $timetablePermanentStore["Subjects"].find(s => s["Id"] === (atomOriginal?.["SubjectId"] ?? "#")) ?? null}

						<!--atom duplicate edge case: there must not be change or subject OV, or there must be a real change => subject or teacher is changed-->
						{@const atom = day?.["Atoms"].find(t => t["HourId"] === hour["Id"] && (t["Change"] === null || t["SubjectId"] === overrideOV["Atoms"][0]["SubjectId"] || t["SubjectId"] !== (atomOriginal?.["SubjectId"] ?? "#") || t["TeacherId"] !== (atomOriginal?.["TeacherId"] ?? "#") || t["RoomId"] !== (atomOriginal?.["RoomId"] ?? "#"))) ?? null}
						{#if day["DayType"] !== "WorkDay" && subjectOriginal}
							<!--special day-->
							<td class={"subject-removed " + past} onclick={() => modalShow(day["DayType"], null, day["DayDescription"])}>
								<span></span>
								<h3>{subjectOriginal["Abbrev"].toUpperCase()}</h3>
								<span>{day["DayType"].toLowerCase()}</span>
							</td>
						{:else if atom}
							{#if atom["SubjectId"]}
								<!--normal atom-->
								{@const group = $timetableStore["Groups"].find(s => s["Id"] === atom["GroupIds"]?.[0] ?? "#")?.["Abbrev"].replace(" ", "").replace($timetableStore["Classes"][0]["Abbrev"], "") ?? ""}
								{@const room = $timetableStore["Rooms"].find(s => s["Id"] === atom["RoomId"])?.["Abbrev"] ?? ""}
								{@const roomOverride = overrideRooms?.[source[$sourceSchoolStore.toString()].find(g => g["id"] === $sourceGroupStore)?.["class"]]}
								{@const subject = $timetableStore["Subjects"].find(s => s["Id"] === atom["SubjectId"]) ?? null}
								{@const teacher = $timetablePermanentStore["Teachers"].find(s => s["Id"] === atom["TeacherId"]) ?? $timetableStore["Teachers"].find(s => s["Id"] === atom["TeacherId"]) ?? null}
								{@const change = (subjectOriginal?.["Id"] ?? "#") !== subject["Id"] && atom["LessonRelease"] !== "override"}
								<td style:background-color={"var(--subject-" + subject["Abbrev"].toUpperCase() + ")"} class={past} onclick={() => modalShow(subject, teacher, atom["Test"] ? "Test: " + atom["Test"] + "\n" + atom["Theme"] : atom["Theme"])}>
									<div class="flex-atom" style:height={atomHeight - 10 + "px"}>
										<!--making the div 10px shorter instead of using padding 5px, idk dont ask me tables behave like shit-->
										<div class="flex-between">
											<span style="text-align: left">{group}</span>
											{#if atom["Test"]}
												<span style="background-color: var(--black); padding: 0 5px; border-radius: var(--border)">test</span>
											{/if}
											{#if room !== ""}
												<span style="text-align: right">{room}</span>
											{:else if subject["Abbrev"].toUpperCase() === "OV"}
												<span style="text-align: right">{overrideMasters?.[teacher?.["Id"]] ?? ""}</span>
											{:else if roomOverride && !roomOverride["ignore"].includes(subject["Abbrev"].toUpperCase())}
												<span style="text-align: right">{roomOverride["rooms"][($timetableStore["Cycles"][0]?.["Id"] ?? overrideWeek(pageWeek)) === "2" ? 1 : 0][j]}</span>
											{:else}
												<span></span>
											{/if}
										</div>
										<h3>{(change ? (subjectOriginal?.["Abbrev"].toUpperCase() ?? "#") + subjectChange : "") + subject["Abbrev"].toUpperCase()}</h3>
										<!--2*5px padding + 2*10px span + 18px h3 and the -1px magic number xd-->
										<div class="flex-between">
											<span style="text-align: left">
												{#if change}
													{#if subjectOriginal}
														<LucidePencil />
													{:else}
														<LucideTriangleAlert />
													{/if}
												{:else}
													<svg></svg>
												{/if}
											</span>
											<span>{teacher?.["Abbrev"] ?? "#"}</span>
											<span style="text-align: right">
												{#if atom["Theme"]}
													<LucideMessageSquareText />
												{:else}
													<svg></svg>
												{/if}
											</span>
										</div>
									</div>
								</td>
							{:else if atom["Change"]["ChangeType"] === "Removed" || atom["Change"]["ChangeType"] === "Canceled"}
								<!--atom removed-->
								<td class={"subject-" + atom["Change"]["ChangeType"].toLowerCase() + " " + past} onclick={() => modalShow(atom["Change"]["ChangeType"], null, atom["Change"]["TypeName"] ?? "Unknown reason")}>
									<span></span>
									<h3>{subjectOriginal?.["Abbrev"].toUpperCase() ?? "#"}</h3>
									<span>{atom["Change"]["TypeName"]?.split(" ")[0].toLowerCase() ?? "removed"}</span>
								</td>
							{/if}
						{:else}
							<!--atom doesnt exist-->
							<td style="cursor: default"></td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<Loading />
{/if}

<style>
	nav {
		display: flex;
		width: 100%;
		height: 40px;
		justify-content: space-evenly;
		align-items: center;
		overflow: hidden;
	}

	nav button {
		display: flex;
		justify-content: center;
		align-items: center;
		border: none;
		background: none;
		margin: 0;
		padding: 0;
		width: 40px;
		height: 40px;
	}

	nav button:active :global(svg) {
		animation: var(--animation-scale);
	}

	nav :global(svg) {
		height: 25px;
		width: 25px;
		stroke: var(--white);
	}

	table {
		display: block;
		border-collapse: collapse;
		overflow-x: auto;
		overflow-y: clip;
		max-width: 100%;
		border-left: 1px var(--gray) solid; /*.slim border*/
		will-change: contents, scroll-position;
		table-layout: fixed;
		white-space: nowrap;
	}

	tr th, tr td {
		min-width: 100px;
		width: 200px;
		user-select: none;
	}

	tr .slim {
		min-width: 80px;
		position: sticky;
		left: 0;
		background-color: var(--black);
		z-index: 10;
		border: none;
		border-top: 1px var(--gray) solid; /*.slim border*/
		border-bottom: 1px var(--gray) solid; /*.slim border*/
		border-right: 1px var(--gray) solid; /*.slim border*/
	}

	td, th {
		text-align: center;
	}

	td {
		box-shadow: inset 0 0 30px 3px rgba(0, 0, 0, 0.2);
		border: 1px var(--gray) solid;
		font-weight: normal;
		padding: 0;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent !important;
	}

	th {
		border: 1px var(--gray) solid;
		padding: 10px;
		font-weight: bold;
	}

	thead tr th {
		padding: 5px;
		position: relative;
	}

	td :global(svg) {
		height: 10px;
		width: 10px;
		stroke-width: 3px; /*default is 2px*/
		stroke: var(--white);
	}

	.day-canteen {
		justify-content: center;
		align-items: center;
		width: 10px;
		height: 15px;
		display: flex;
		position: absolute;
		top: 39px;
		left: 50%;
		transform: translate(-50%);
		box-shadow: 0 5px 20px 1px rgba(0, 0, 0, 1);
		z-index: 4;
	}

	.day-canteen-shape {
		width: 40px;
		height: 15px;
		position: absolute;
		background: var(--brand);
		clip-path: polygon(0 0, 20% 100%, 80% 100%, 100% 0);
	}

	.day-canteen :global(svg) {
		height: 10px;
		width: 10px;
		stroke-width: 3px;
		stroke: var(--white);
		z-index: 5;
	}

	.subject-past {
		opacity: 0.4;
	}

	.subject-removed {
		background: repeating-linear-gradient(45deg, var(--black), var(--black) 10px, rgba(255, 255, 255, 0.2) 10px, rgba(255, 255, 255, 0.2) 20px);
	}

	.subject-canceled {
		background: repeating-linear-gradient(135deg, var(--black), var(--black) 10px, rgba(126, 101, 177, 0.4) 10px, rgba(126, 101, 177, 0.4) 20px);
	}

	.flex-atom {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0 5px;
	}

	.flex-between {
		display: flex;
		justify-content: space-between;
	}

	.flex-between span {
		min-width: 12px;
	}

	/*hours: 9*/
	@media screen and (max-height: 660px) {
		table {
			overflow-y: auto;
		}
	}

	/*hours: 10*/
	/*@media screen and (max-height: 690px) {
	       table {
	           overflow-y: auto;
	       }
	   }*/
</style>
