<script>
    import {onMount} from "svelte"
    import {navigate} from "svelte-routing"

    onMount(() => {
        navigate("/countdown", {replace: true})
    })
</script>