<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>TDX KB Automation | Workspace</title>
</svelte:head>

<main class="landing-wrapper">
	<div class="hero">
		<h1>TDX KB AUTOMATION</h1>
		<p>Select your preferred workspace.</p>
	</div>

	<div class="selection-grid">
		<a href="{resolve('/frosted')}" class="choice-card vibe-card">
			<div class="preview-window vibe-preview">
				<div class="vibe-nav"></div>
				<div class="vibe-content">
					<div class="vibe-box"></div>
					<div class="vibe-box"></div>
					<div class="vibe-box"></div>
					<div class="vibe-box"></div>
				</div>
			</div>
			<div class="card-text">
				<h2>Frosted Edition</h2>
				<p>Glassmorphism, ambient glows, rounded buttons. The new standard.</p>
			</div>
		</a>

		<a href="{resolve('/ledger')}" class="choice-card ledger-card">
			<div class="preview-window ledger-preview">
				<div class="ledger-nav">
					<div class="ledger-line"></div>
					<div class="ledger-line"></div>
				</div>
				<div class="ledger-content">
					<div class="ledger-box"></div><div class="ledger-box"></div>
					<div class="ledger-box"></div><div class="ledger-box"></div>
					<div class="ledger-box"></div><div class="ledger-box"></div>
				</div>
			</div>
			<div class="card-text">
				<h2 class="mono">LEDGER EDITION</h2>
				<p class="mono">High-density, rigid grid. Functional visibility.</p>
			</div>
		</a>
	</div>
</main>

<style>

	.mono {
		font-family: 'SFMono-Regular', Consolas, monospace;
		letter-spacing: 0.05em;
	}

	.landing-wrapper {
		background-color: #050505;
		color: #ffffff;
		font-family: 'Inter', system-ui, sans-serif;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		box-sizing: border-box;
	}

	.hero {
		text-align: center;
		margin-bottom: 4rem;
	}

	.hero h1 {
		font-size: 2.5rem;
		margin: 0 0 0.5rem 0;
		letter-spacing: 0.1em;
	}

	.hero p {
		color: #888;
		margin: 0;
	}

	.selection-grid {
		display: flex;
		gap: 3rem;
		max-width: 1000px;
		width: 100%;
	}

	@media (max-width: 768px) {
		.selection-grid {
			flex-direction: column;
		}
	}

	.choice-card {
		flex: 1;
		text-decoration: none;
		color: inherit;
		background: #0d0d0d;
		border: 1px solid #222;
		border-radius: 16px;
		padding: 2rem;
		transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.choice-card:hover {
		transform: translateY(-5px);
	}

	.card-text h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
	}

	.card-text p {
		margin: 0;
		color: #888;
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.preview-window {
		width: 100%;
		height: 200px;
		background: #000;
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	/* frosted */
	.vibe-card:hover {
		border-color: #ceb888;
		box-shadow: 0 10px 30px rgba(206, 184, 136, 0.1);
	}
	.vibe-preview {
		background: linear-gradient(135deg, #0b0f15 0%, #151a22 100%);
		padding: 1rem;
		box-sizing: border-box;
		gap: 1rem;
	}
	.vibe-nav {
		height: 20px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 4px;
		width: 40%;
	}
	.vibe-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		flex: 1;
	}
	.vibe-box {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 6px;
	}

	/* ledger */
	.ledger-card {
		border-radius: 0; 
	}
	.ledger-card:hover {
		border-color: #fff;
		background: #111;
	}
	.ledger-preview {
		background: #000;
		border: 1px solid #333;
		border-radius: 0;
	}
	.ledger-nav {
		padding: 1rem 1rem 0.5rem 1rem;
		border-bottom: 1px solid #333;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.ledger-line {
		height: 6px;
		background: #333;
		width: 60%;
	}
	.ledger-line:last-child {
		width: 30%;
	}
	.ledger-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		flex: 1;
	}
	.ledger-box {
		border-right: 1px solid #333;
		border-bottom: 1px solid #333;
		background: transparent;
	}
</style>