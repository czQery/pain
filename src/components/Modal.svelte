<script>
    import {LucideX} from "lucide-svelte"

    let {modal = $bindable(), title = "Alert", children} = $props()
</script>


<!--svelte-ignore a11y_no_noninteractive_element_interactions-->
<dialog bind:this={modal} onclick={(e) => e.target.tagName === "DIALOG" ? modal.close() : null} onkeydown={(e) => {if(e.keyCode === 27)modal.close()}} aria-label="Close">
    <div class="dialog-block">
        <header>
            <h3 style="color:var(--silver)">{title}</h3>
            <button onclick={modal.close()}>
                <LucideX/>
            </button>
        </header>
        <div>
            {#if children}
                {@render children()}
            {/if}
        </div>
    </div>
</dialog>

<style>
    dialog {
        z-index: 30;
        margin: 0;
        padding: 0;
        border: none;
        background: var(--brand-milky);
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
        min-width: 270px;
    }

    .dialog-block header {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px var(--gray) solid;
        padding: 20px;
        height: 58px;
    }

    .dialog-block header button {
        background: none;
        border: none;
        text-decoration: none;
        -webkit-tap-highlight-color: transparent !important;
        outline: none !important;
        padding: 0;
        height: 18px;
        width: 18px;
    }

    .dialog-block header :global(svg) {
        height: 18px;
        width: 18px;
        stroke: var(--silver);
    }

    .dialog-block div {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
</style>