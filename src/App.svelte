<script>
    import {Link, Route, Router} from "svelte-routing"
    import Timetable from "./routes/Timetable.svelte"
    import Index from "./routes/Index.svelte"
    import {LucideClock, LucideSheet} from "lucide-svelte"
    import {timetableFetch} from "./lib/timetable.js"

    timetableFetch()
</script>

<Router>
    <main class="container">
        <Route path="/countdown"/>
        <Route path="/timetable" component={Timetable}/>
        <Route component={Index}></Route>
    </main>
    <footer>
        <ul>
            <li>
                <Link class="link" to="/countdown">
                    <LucideClock/>
                </Link>
            </li>
            <li>
                <Link class="link" to="/timetable">
                    <LucideSheet/>
                </Link>
            </li>
            <li style="display: none">
                <a class="link" href="/">class bypass</a>
            </li>
        </ul>
    </footer>
</Router>

<style>
    main {
        display: flex;
        width: 100%;
        justify-content: center;
        height: calc(100svh - 50px);

        --subject-A: #0A2239;
        --subject-AJ: #d5334b;
        --subject-CAD: #5c6073;
        --subject-ČJL: #f2c40e;
        --subject-ČT: #dd7571;
        --subject-E: #058E3F;
        --subject-EM: #a845b3;
        --subject-ET: #11bb41;
        --subject-EK: #fa147f;
        --subject-M: #23b1d2;
        --subject-ON: #363537;
        --subject-OV: #a09262;
        --subject-TV: #f5980c;
    }

    footer {
        height: 50px;
        width: 100%;
    }

    footer ul {
        display: flex;
        margin: 0;
        padding: 0;
        height: 100%;
        justify-content: space-evenly;
        list-style-type: none;
        text-decoration: none;
    }

    footer :global(svg) {
        display: block;
        height: 40px;
        margin: 5px;
    }
</style>