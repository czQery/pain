<script>
    import {timetableGroups, timetableGroupStore} from "../lib/timetable.js"
    import {preload} from "../lib/preload.js"
</script>

<div id="settings-block">
    <div id="settings-group">
        <label for="group">Group</label>
        <select id="group" bind:value={$timetableGroupStore} onchange={() => {
            localStorage.setItem("group", $timetableGroupStore.toString())
            preload($timetableGroupStore.toString())
        }}>
            {#each timetableGroups as g}
                <option value={g["id"]}>
                    {g["name"]}
                </option>
            {/each}
        </select>
    </div>
    <div>
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
        padding: 30px;
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

    #settings-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 0 0 60px 0;
    }

    #settings-group select {
        width: 200px;
    }

    #settings-group label {
        margin: 0 0 0 5px;
    }
</style>