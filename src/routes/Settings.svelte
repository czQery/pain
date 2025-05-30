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
		<label for="group">School</label>
		<select id="group" bind:value={$sourceSchoolStore} onchange={() => setSchool()}>
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
	<div style="margin: 60px 0 0 0">
		<span>Zde může být i tvoje třída/skupina stačí když mi pošleš</span>
		<span style="color: var(--pink)">refresh-token</span>
		<span>z tvého bakaláře na discord @czqery</span>
	</div>

	<code>curl -d "grant_type=password&client_id=ANDR&username=<strong>jméno</strong>&password=<strong>heslo</strong>&scope=bakalari_api+offline_access+timetable_widget" https://sssenp.bakalari.cz/api/login</code>
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

#settings-block code {
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
</style>
