<script>
	import Sparticles from "sparticles"

	const sparticles = { composition: "source-over", count: 60, speed: 1, parallax: 20, direction: 190, xVariance: 5, yVariance: 5, rotate: true, rotation: 0.9, alphaSpeed: 0, alphaVariance: 2, minAlpha: 0.4, maxAlpha: 1, minSize: 2, maxSize: 12, style: "fill", bounce: false, drift: 2, glow: 10, twinkle: false, color: ["#8f8f8f"], shape: "circle", imageUrl: "" }

	const addSparticles = node => {
		new Sparticles(node, sparticles)
	}
</script>

<div id="season-winter" use:addSparticles></div>

<style>
	#season-winter {
		position: absolute;
		width: 100%;
		height: calc(100svh - 50px);
	}

	#season-winter :global(.sparticles) {
		width: inherit;
		height: inherit;
	}
</style>
