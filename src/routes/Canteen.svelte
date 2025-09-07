<script>
	import {onDestroy, onMount} from "svelte"
	import Loading from "../components/Loading.svelte"
	import {canteenFetch, canteenStore} from "../lib/canteen.js"
	import {cOffline} from "../lib/const.js"
	import {formatDate, formatDay} from "../lib/format.js"
	import {getWeek} from "../lib/helper.js"
	import {overrideCanteen, overrideOrdering, overrideOVGroup} from "../lib/override.js"
	import {timetablePermanentStore} from "../lib/timetable.js"
	import {sourceGroupStore, sourceSchoolStore} from "../lib/var.js"

	let time = $state(new Date())
	let interval

	onMount(async () => {
		if (interval) clearInterval(interval)
		interval = setInterval(() => {
			time = new Date()
			if (!$canteenStore) {
				canteenFetch($sourceSchoolStore.toString())
			}
		}, cOffline)
	})

	onDestroy(() => {
		clearInterval(interval)
	})
</script>

{#if $canteenStore}
	<div id="canteen-block" style:padding-bottom={overrideOrdering[$sourceSchoolStore] ? "60px" : "20px"}>
		{#each $canteenStore as day, _}
			<!--DEBUG
            <h3>{time.getDate() + "." + time.getMonth() + "-" + date.getDate() + "." + date.getMonth()}</h3>
            <span>{JSON.stringify(day)}</span>-->
			{@const date = new Date(Number(day["date"]))}
			{@const ovGroup = overrideOVGroup[$sourceGroupStore]?.[(getWeek(date)) % 2 === 0 ? 1 : 0]?.[date.getDay() - 1]}
			{@const ovOverride = overrideCanteen[ovGroup]?.[(getWeek(date)) % 2 === 0 ? 1 : 0]?.[date.getDay() - 1]}
			{@const ovMaster = ($timetablePermanentStore?.["Teachers"] || []).find(s => s["Id"] === ovGroup)}
			{#if time.getMonth() < date.getMonth() || (time.getMonth() === date.getMonth() && time.getDate() <= date.getDate())}
				<!--date correction-->
				<div class="canteen-day">
					<div class="canteen-title">
						<h2>{formatDay(date)}</h2>
						<h3>{"- " + formatDate(date)}</h3>
					</div>
					<div class="canteen-lines">
						{#if day["open"]}
							<h3 style="color: var(--snow)">{day["soup"]}</h3>
							{#each day["menus"] as menu, i}
								<div style="display: flex; gap: 5px">
									{#if day["menus"].length > 1}
										<h3 style="color: var(--silver)">{(i + 1).toString() + ":"}</h3>
									{/if}
									<h3 style="color: var(--snow)">{menu}</h3>
								</div>
							{/each}
							<h3 style="color: var(--silver)">{day["extra"]}</h3>
						{:else}
							<h3 style="color: var(--silver)">Closed</h3>
						{/if}
					</div>
					{#if ovGroup && ovOverride}
						<h3 style="color: var(--subject-OV)">{"OV: " + ovOverride + " (" + (ovMaster?.["Name"] ?? ovGroup) + ")"}</h3>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
	{#if overrideOrdering[$sourceSchoolStore]}
		<a id="canteen-button" target="_blank" rel="noopener noreferrer" href={overrideOrdering[$sourceSchoolStore]}>Ordering</a>
	{/if}
{:else}
	<Loading />
{/if}

<style>
	#canteen-block {
		display: flex;
		width: 100%;
		flex-direction: column;
		overflow-y: auto;
		padding: 20px;
		align-items: center;
		gap: 20px;
		will-change: scroll-position;
		z-index: 10;
	}

	.canteen-day {
		display: flex;
		flex-direction: column;
		gap: 10px;
		max-width: 500px;
		width: 100%;
	}

	.canteen-title {
		display: flex;
		gap: 5px;
		align-items: baseline;
	}

	.canteen-title h2 {
		background: var(--brand);
		color: transparent;
		background-clip: text;
	}

	.canteen-title h3 {
		color: var(--silver);
	}

	.canteen-lines {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.canteen-lines h3 {
		font-weight: normal;
	}

	#canteen-button {
		width: calc(min(540px, 100%) - 20px);
		height: 40px;
		margin: 10px;
		bottom: calc(50px + var(--bar));
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: var(--border);
		z-index: 15;
		color: var(--white);
		text-decoration: none;
		font-size: 18px;
		background-color: var(--black);
		border: 1px var(--gray) solid;
		box-shadow: 0 0 40px 20px var(--black);
	}
</style>
