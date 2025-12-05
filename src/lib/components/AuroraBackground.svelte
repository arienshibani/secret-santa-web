<!-- Aurora background effect inspired by reactbits.dev - Christmas themed -->
<div class="aurora-background fixed inset-0 -z-10 overflow-hidden pointer-events-none">
	<div class="aurora-orb aurora-orb-1"></div>
	<div class="aurora-orb aurora-orb-2"></div>
	<div class="aurora-orb aurora-orb-3"></div>
	<div class="aurora-orb aurora-orb-4"></div>
</div>

<style>
	.aurora-background {
		background: linear-gradient(to bottom, #000000, #0a0a0a, #1a1a1a);
	}

	.aurora-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.6;
		will-change: transform;
	}

	/* Aurora colors: light blue, green, indigo, and pink */
	.aurora-orb-1 {
		width: 500px;
		height: 500px;
		background: radial-gradient(circle, rgba(135, 206, 250, 0.5), rgba(135, 206, 250, 0));
		top: -200px;
		left: -200px;
		animation: aurora-float-1 25s ease-in-out infinite;
	}

	.aurora-orb-2 {
		width: 600px;
		height: 600px;
		background: radial-gradient(circle, rgba(50, 255, 50, 0.5), rgba(50, 255, 50, 0));
		top: 50%;
		right: -300px;
		animation: aurora-float-2 30s ease-in-out infinite;
	}

	.aurora-orb-3 {
		width: 400px;
		height: 400px;
		background: radial-gradient(circle, rgba(138, 43, 226, 0.4), rgba(138, 43, 226, 0));
		bottom: -150px;
		left: 20%;
		animation: aurora-float-3 35s ease-in-out infinite;
	}

	.aurora-orb-4 {
		width: 550px;
		height: 550px;
		background: radial-gradient(circle, rgba(255, 100, 150, 0.4), rgba(255, 100, 150, 0));
		top: 20%;
		left: 50%;
		animation: aurora-float-4 28s ease-in-out infinite;
	}

	@keyframes aurora-float-1 {
		0% {
			transform: translate(0, 0) scale(1);
		}
		25% {
			transform: translate(150px, 100px) scale(1.2);
		}
		50% {
			transform: translate(-80px, 200px) scale(0.8);
		}
		75% {
			transform: translate(120px, -60px) scale(1.1);
		}
		100% {
			transform: translate(0, 0) scale(1);
		}
	}

	@keyframes aurora-float-2 {
		0% {
			transform: translate(0, 0) scale(1);
		}
		25% {
			transform: translate(-100px, 80px) scale(1.15);
		}
		50% {
			transform: translate(60px, -120px) scale(0.85);
		}
		75% {
			transform: translate(-80px, 150px) scale(1.05);
		}
		100% {
			transform: translate(0, 0) scale(1);
		}
	}

	@keyframes aurora-float-3 {
		0% {
			transform: translate(0, 0) scale(1);
		}
		25% {
			transform: translate(100px, -80px) scale(1.1);
		}
		50% {
			transform: translate(-120px, 100px) scale(0.9);
		}
		75% {
			transform: translate(80px, 120px) scale(1.05);
		}
		100% {
			transform: translate(0, 0) scale(1);
		}
	}

	@keyframes aurora-float-4 {
		0% {
			transform: translate(0, 0) scale(1);
		}
		25% {
			transform: translate(-120px, 100px) scale(1.2);
		}
		50% {
			transform: translate(100px, -100px) scale(0.8);
		}
		75% {
			transform: translate(-60px, 80px) scale(1.1);
		}
		100% {
			transform: translate(0, 0) scale(1);
		}
	}
</style>

