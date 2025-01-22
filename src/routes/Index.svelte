<script>
    import {onMount} from "svelte"
    import {navigate} from "svelte5-router"

    onMount(() => {
        navigate("/countdown", {replace: true})
    })
</script>