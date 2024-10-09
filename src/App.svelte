<script>
    import {Link, Route, Router} from "svelte-routing"
    import Timetable from "./routes/Timetable.svelte"
    import Index from "./routes/Index.svelte"
    import {LucideCalendarRange, LucideClock, LucideSettings, LucideUtensilsCrossed} from "lucide-svelte"
    import {timetablePermanentFetch} from "./lib/timetable.js"
    import Countdown from "./routes/Countdown.svelte"
    import {onMount} from "svelte"
    import Canteen from "./routes/Canteen.svelte"
    import Settings from "./routes/Settings.svelte";

    onMount(() => {
        document.getElementById("init-loading").style.display = "none"
        document.getElementById("app").style.display = "flex"

        timetablePermanentFetch()
    })
</script>

<Router>
    <main class="container">
        <Route path="/countdown" component={Countdown}/>
        <Route path="/timetable" component={Timetable}/>
        <Route path="/canteen" component={Canteen}/>
        <Route path="/settings" component={Settings}/>
        <Route component={Index}></Route>
    </main>
    <footer>
        <ul>
            <li>
                <Link to="/countdown">
                    <LucideClock/>
                </Link>
            </li>
            <li>
                <Link to="/timetable">
                    <LucideCalendarRange/>
                </Link>
            </li>
            <li>
                <Link to="/canteen">
                    <LucideUtensilsCrossed/>
                </Link>
            </li>
            <li>
                <Link to="/settings">
                    <LucideSettings/>
                </Link>
            </li>
        </ul>
    </footer>
</Router>

<style>
    main {
        display: flex;
        width: 100%;
        align-items: center;
        flex-direction: column;
        height: calc(100svh - 50px);

        --subject-NON: var(--silver);

        --subject-A: #0c355b;
        --subject-AJ: #d5334b;
        --subject-CAD: #5f6895;
        --subject-ČJL: #f2c40e;
        --subject-ČT: #dd7571;
        --subject-E: #058e3f;
        --subject-EM: #a845b3;
        --subject-ET: #11bb41;
        --subject-EK: #fa147f;
        --subject-M: #23b1d2;
        --subject-ON: #851049;
        --subject-OV: #885d4c;
        --subject-TV: #f5980c;
    }

    footer {
        height: 50px;
        width: 100%;
        user-select: none;
        outline: 1px var(--gray) solid;
        z-index: 20;
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

    footer :global(a:active svg) {
        animation: var(--animation-scale);
    }

    footer :global(svg) {
        display: block;
        height: 40px;
        margin: 5px;
        stroke: var(--white)
    }

    footer ul li {
        width: 100%;
        max-width: 200px;
    }
</style>