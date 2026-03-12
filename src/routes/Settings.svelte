<script>
	import { preload } from "../lib/preload.js"
	import { umami } from "../lib/umami.js"
	import { source, sourceGroupStore, sourceSchoolStore } from "../lib/var.js"

	const setSchool = () => {
		localStorage.setItem("school", $sourceSchoolStore.toString())

		// forward to group change
		sourceGroupStore.set(source[$sourceSchoolStore.toString()][0]["id"]) // set default group
		setGroup()
	}

	const setGroup = () => {
		localStorage.setItem("group", $sourceGroupStore.toString())
		preload($sourceSchoolStore.toString(), $sourceGroupStore.toString())
		umami($sourceSchoolStore.toString(), $sourceGroupStore.toString())
	}
</script>

<div id="settings-block">
	<div id="settings-input">
		<label for="school">School</label>
		<select id="school" bind:value={$sourceSchoolStore} onchange={() => setSchool()}>
			{#each Object.keys(source) as s}
				<option value={s}>
					{s}
				</option>
			{/each}
		</select>
	</div>
	<div id="settings-input">
		<label for="group">Group</label>
		<select id="group" bind:value={$sourceGroupStore} onchange={() => setGroup()}>
			{#each source[$sourceSchoolStore.toString()] as g}
				<option value={g["id"]}>
					{g["name"]}
				</option>
			{/each}
		</select>
	</div>
	<div id="settings-note">
		<span>Contact me on discord to add your school/group.</span>
		<span style="color: var(--pink)">@czqery</span>
	</div>
</div>

<style>
	#settings-block {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 20px;
		height: inherit;
		justify-content: center;
		gap: 20px;
		align-items: center;
	}

	#settings-block span {
		display: inline-block;
		color: var(--silver);
	}

	#settings-input {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	#settings-input select {
		width: 200px;
	}

	#settings-input label {
		margin: 0 0 0 5px;
	}

	#settings-note {
		margin: 20px 0 0 0;
		gap: 5px;
		flex-direction: column;
		display: flex;
		align-items: center;
		text-align: center;
	}

	@media screen and (max-height: 350px) {
		#settings-block {
			gap: 10px;
		}

		#settings-note {
			margin: 0;
		}
	}
</style>
