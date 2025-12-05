<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let animationFrame: number;

	const snowflakes: Array<{
		x: number;
		y: number;
		radius: number;
		speed: number;
		opacity: number;
	}> = [];

	const createSnowflake = () => {
		const width = canvas?.width || (typeof window !== 'undefined' ? window.innerWidth : 800);
		return {
			x: Math.random() * width,
			y: -10,
			radius: Math.random() * 3 + 1,
			speed: Math.random() * 2 + 1,
			opacity: Math.random() * 0.5 + 0.5
		};
	};

	const initSnow = () => {
		if (!canvas || !ctx) return;

		const numFlakes = Math.floor((canvas.width * canvas.height) / 15000);
		snowflakes.length = 0; // Clear existing
		for (let i = 0; i < numFlakes; i++) {
			snowflakes.push(createSnowflake());
		}
	};

	const animate = () => {
		if (!canvas || !ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (let i = snowflakes.length - 1; i >= 0; i--) {
			const flake = snowflakes[i];
			flake.y += flake.speed;
			flake.x += Math.sin(flake.y * 0.01) * 0.5;

			if (flake.y > canvas.height) {
				snowflakes[i] = createSnowflake();
			}

			ctx.beginPath();
			ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
			ctx.fill();
		}

		animationFrame = requestAnimationFrame(animate);
	};

	const handleResize = () => {
		if (!canvas) return;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	};

	onMount(() => {
		if (typeof window === 'undefined' || !canvas) return;
		
		ctx = canvas.getContext('2d');
		if (!ctx) return;
		
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		initSnow();
		animate();
		window.addEventListener('resize', handleResize);

		return () => {
			if (animationFrame) cancelAnimationFrame(animationFrame);
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="fixed inset-0 pointer-events-none z-0"
	style="background: linear-gradient(180deg, #0a0e27 0%, #1a1f3a 100%);"
></canvas>

