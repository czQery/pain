<script>
    export let modal
</script>

<dialog bind:this={modal}>

</dialog>

<style>
    dialog {
        width: calc(100% - 20px);
        max-width: 500px;
        max-height: 500px;
        background-color: var(--white);
        height: calc(100svh - 20px);
        z-index: 30;
        border-radius: var(--border);
        opacity: 0.4;

        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>