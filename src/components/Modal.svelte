<script>
    export let modal
</script>

<dialog bind:this={modal} on:click={(e) => e.target.tagName === "DIALOG" ? modal.close() : null}>
    <div class="dialog-block">
        <slot>
        </slot>
    </div>
</dialog>

<style>
    dialog {
        z-index: 30;
        margin: 0;
        padding: 0;
        border: none;
        background-color: rgba(0, 0, 0, 0.8);
    }

    dialog[open] {
        display: flex;
        width: 100%;
        height: 100svh;
        justify-content: center;
        align-items: center;
    }

    .dialog-block {
        background-color: var(--black);
        border: 1px var(--gray) solid;
        border-radius: var(--border);
        max-width: calc(100% - 100px);
        max-height: calc(100svh - 100px);
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
</style>