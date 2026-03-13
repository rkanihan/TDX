<script lang="ts">
	import { resolve } from '$app/paths';
	export let data;
    export let form;
</script>

<svelte:head>
	<title>TDX KB Automation | Workspace</title>
</svelte:head>

{#if !data.hasToken}
	<div class="token-wrapper">
		<div class="token-container">
			<h2>Please enter your token.</h2>
			<a href="https://service.purdue.edu/TDWebApi/api/auth/loginsso" target="_blank" rel="noopener noreferrer" class="token-link">Where do I get this?</a>

			<form autocomplete="off" method="POST" action="?/saveToken" class="token-form">
				<input 
					type="password" 
					name="token" 
					placeholder="Bearer Token..." 
					required 
					class="input-field"
				/>
				<button type="submit" class="submit-btn">Submit Token</button>
			</form>

			{#if form?.missing}
				<p class="error">A valid token is required.</p>
			{/if}
		</div>
	</div>

{:else}

	<form autocomplete="off" method="POST" action="?/clearToken">
        <button type="submit" class="clear-btn">Clear Token</button>
    </form>

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

{/if}

<style>

	.mono {
		font-family: 'SFMono-Regular', Consolas, monospace;
		letter-spacing: 0.05em;
	}

	.landing-wrapper {
		background-color: #050505;
		color: #ffffff;
		font-family: 'Inter', system-ui, sans-serif;
		min-height: 80vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		box-sizing: border-box;
	}

	.token-link {
		text-decoration: none;
		color: var(--text-secondary, #aaaaaa);
        margin-bottom: 1rem;
		display: block;
		max-width: fit-content;
		margin-left: auto;
		margin-right: auto;
	}

	.token-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 80vh;
        padding: 3rem;
    }

	.token-container {
        background: var(--bg-surface, rgba(30, 30, 35, 0.6));
        backdrop-filter: blur(16px);
        border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
        border-radius: 16px;
        padding: 3rem 2.5rem;
        max-width: 525px;
        width: 100%;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    }

	.token-container h2 {
        color: var(--text-primary, #ffffff);
		font-size: 3rem;
        margin-bottom: 1.7rem;
		margin-top: 0;
        font-weight: 800;
        letter-spacing: -0.06rem;
		line-height: 1;

		font-family:
			'Inter',
			system-ui,
			-apple-system,
			sans-serif;
    }

	.token-container a {
		font-size: 1.35rem;
		color: var(--text-secondary, #aaaaaa);
		text-decoration: none;

		font-family:
			'Inter',
			system-ui,
			-apple-system,
			sans-serif;
	}

	.token-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

	.input-field {
        width: 100%;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
        border-radius: 8px;
        padding: 1rem;
        color: var(--text-primary, #ffffff);
        font-size: 1rem;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
        box-sizing: border-box;
    }

	.input-field:focus {
        outline: none;
        border-color: var(--text-primary, #ffffff);
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
    }

	.submit-btn {
        background: var(--text-primary, #ffffff);
        color: var(--bg-main, #000000);
        border: none;
        border-radius: 8px;
        padding: 0.8rem;
        font-size: 1.25rem;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 1px;

		font-family:
			'Inter',
			system-ui,
			-apple-system,
			sans-serif;
    }

	.submit-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
        background: #e0e0e0; 
    }

	.error {
        color: #ff5555;
        background: rgba(255, 85, 85, 0.1);
        border: 1px solid rgba(255, 85, 85, 0.3);
        padding: 0.75rem;
        border-radius: 6px;
        margin-top: 1.25rem;
        font-size: 0.9rem;
    }

	.clear-btn {
        background: transparent;
        color: var(--text-secondary, #a0a0a0);
        border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
        border-radius: 6px;
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s ease;
        margin: 2rem auto 0;
        display: block;
    }

    .clear-btn:hover {
        color: var(--text-primary, #ffffff);
        border-color: var(--text-primary, #ffffff);
        background: rgba(255, 255, 255, 0.05);
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