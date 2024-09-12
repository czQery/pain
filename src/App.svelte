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

        --subject-A: #0A176C;
        --subject-AJ: #B70A28;
        --subject-ČT: #1ebd5c;
        --subject-ON: #9B9015;
        --subject-CAD: #5c6073;
        --subject-ČJL: #deae0f;
        --subject-E: #148C33;
        --subject-ET: #4f6b1f;
        --subject-M: #1492c5;
        --subject-EM: #6414c5;
        --subject-TV: #c2569f;
        --subject-EK: #9a1f1c;
        --subject-OV: #734431;
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