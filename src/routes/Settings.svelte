<script>
</script>

<div id="settings-block">
    <div>
        <h3>Zde může být přepínač na tvojí skupinu, stačí když mi pošleš</h3>
        <h3 style="color: var(--pink)">refresh-token</h3>
        <h3>z tvého bakaláře na discord @czqery</h3>
    </div>

    <h3>Vlož příkaz do cmd a nahraď jméno a heslo svými údaji</h3>

    <code>curl -d "grant_type=password&client_id=ANDR&username=<strong>jméno</strong>&password=<strong>heslo</strong>&scope=bakalari_api+offline_access+timetable_widget" https://sssenp.bakalari.cz/api/login</code>

    <h3>To vypíše dlouhý text kde by jsi měl najít:</h3>
    <div>
        <h3>"refresh-token": "</h3><h3 style="color: var(--pink)">tohle bych poprosil</h3><h3>"</h3>
    </div>

    <span>*když ti nepůjde příkaz vložit do cmd zkus místo CTRL+V prostě kliknout pravým tlačítkem na myši</span>
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
    }

    #settings-block h3 {
        display: inline-block;
    }
</style>