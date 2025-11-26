<script>
	import Sparticles from "sparticles"
	import { onMount } from "svelte"

	const sparticles = { composition: "source-over", count: 60, speed: 1, parallax: 20, direction: 190, xVariance: 5, yVariance: 5, rotate: true, rotation: 0.9, alphaSpeed: 0, alphaVariance: 2, minAlpha: 0.4, maxAlpha: 1, minSize: 2, maxSize: 12, style: "fill", bounce: false, drift: 2, glow: 10, twinkle: false, color: ["#8f8f8f"], shape: "circle", imageUrl: "" }
	let addSparticles = undefined

	onMount(() => {
		if (addSparticles) return
		addSparticles = node => {
			new Sparticles(node, sparticles)
		}
	})
</script>

{#if addSparticles}
	<div id="season-winter" use:addSparticles></div>
{/if}

<style>
	#season-winter {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: calc(100svh - 50px - var(--bar));
		animation: var(--animation-fade-in-long);
	}

	#season-winter :global(.sparticles) {
		width: inherit;
		height: inherit;
	}
</style>
