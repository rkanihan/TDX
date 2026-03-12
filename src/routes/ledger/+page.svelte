<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import ArticleRow from '$lib/ArticleRow.svelte';
	import Spinner from '$lib/Spinner.svelte';
	import { resolve } from '$app/paths';

	export let data: PageData;
	export let form: ActionData;
	let isSubmitting = false;

	let mounted = false;

	onMount(() => {
		mounted = true;
	});

	let gridWidth = 0;

	$: columns = gridWidth > 0 ? Math.floor(gridWidth / 280) : 1;

	let selectedIds: number[] = data.articles.map(a => a.ID);

	$: allChecked = data.articles.length > 0 && selectedIds.length === data.articles.length;

	let isCascading = false;

	async function toggleAll() {
		if (isCascading || data.articles.length === 0) return;
		isCascading = true;

		const delayAmount = 45; 

		const grid = document.querySelector('.ledger-body');
		let columns = 1;
		if (grid) {
			const style = window.getComputedStyle(grid);
			columns = style.getPropertyValue('grid-template-columns').split(' ').length;
		}

		const distanceGroups: Record<number, number[]> = {};
		
		data.articles.forEach((article, index) => {
			const gridPosition = index + 1; 
			const row = Math.floor(gridPosition / columns);
			const col = gridPosition % columns;
			const distance = row + col;

			if (!distanceGroups[distance]) {
				distanceGroups[distance] = [];
			}
			distanceGroups[distance].push(article.ID);
		});

		const sortedDistances = Object.keys(distanceGroups).map(Number).sort((a, b) => a - b);

		if (allChecked) {
			for (const distance of sortedDistances) {
				const idsToRemove = distanceGroups[distance];
				selectedIds = selectedIds.filter(id => !idsToRemove.includes(id));
				await new Promise(resolve => setTimeout(resolve, delayAmount));
			}
		} else {
			for (const distance of sortedDistances) {
				const idsToAdd = distanceGroups[distance];
				const newIds = [...selectedIds];
				idsToAdd.forEach(id => {
					if (!newIds.includes(id)) newIds.push(id);
				});
				selectedIds = newIds;
				await new Promise(resolve => setTimeout(resolve, delayAmount));
			}
		}

		isCascading = false;
	}

</script>

<svelte:head>
	<title>TDX Automation / Ledger</title>
</svelte:head>

<div class="dashboard-container">
	<header class="masthead">
		<div class="masthead-top">
			<a href="{resolve('/')}" class="href-style">
				<h1>TDX KB AUTOMATION</h1>
			</a>
			<div class="status-indicator">
				<div class="status-dot {form?.success ? 'success' : form?.message ? 'error' : 'idle'}"></div>
				<span class="mono">
					{#if form?.success}
						SYS.SUCCESS
					{:else if form?.message}
						SYS.ERROR
					{:else}
						SYS.IDLE
					{/if}
				</span>
			</div>
		</div>
		
		<div class="masthead-bottom">
			<p>BATCH TICKET GENERATION & REVIEW TASK ASSIGNMENT</p>
			<div class="nav-links mono">
				<a href="https://github.com/rkanihan/TDX" target="_blank" rel="noopener noreferrer">[ GITHUB ]</a>
				<a href="https://service.purdue.edu/TDNext/Home/Desktop/Default.aspx" target="_blank" rel="noopener noreferrer">[ TDX APP ]</a>
				<a href="https://service.purdue.edu/TDWebApi/" target="_blank" rel="noopener noreferrer">[ API DOCS ]</a>
			</div>
		</div>
	</header>

	{#if form?.success || form?.message}
		<div class="system-message {form?.success ? 'msg-success' : 'msg-error'} mono">
			{form.message}
		</div>
	{/if}

	<form
		method="POST"
		action="?/startReview"
		class="automation-form"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				await update();
				isSubmitting = false;
			};
		}}
	>
		<main class="content-area">
			{#if data.articles.length === 0}
				<div class="empty-state mono">
					[ NO ARTICLES DUE FOR REVIEW IN THE NEXT 60 DAYS ]
				</div>
			{:else}
				<div class="ledger">
					<div class="ledger-body" bind:clientWidth={gridWidth}>
						{#if mounted && gridWidth > 0}

							<button type="button" class="action-cell" on:click={toggleAll}>
								<div class="cell-content">
									<div class="cell-top">
										<div class="sharp-checkbox {allChecked ? 'is-checked' : ''}"></div>
										<div class="col-id mono">SYS.SEL</div>
									</div>
									<div class="col-title">{allChecked ? 'UNCHECK ALL' : 'SELECT ALL'}</div>
									<div class="col-due mono">BATCH ACTION</div>
								</div>
							</button>

							{#each data.articles as article, i (article.ID)}
								<ArticleRow {article} {i} {columns} bind:selectedIds />
							{/each}
						{/if}
					</div>
				</div>
			{/if}
		</main>

		<div class="control-panel">
			<div class="control-inner">
				<div class="assignments">
					<div class="input-group">
						<label for="reqUser">REQUESTOR ID</label>
						<input
							type="text"
							id="reqUser"
							name="requestorUsername"
							placeholder="e.g., guy13"
							class="mono"
							required
						/>
					</div>
					<div class="input-group">
						<label for="respUser">RESPONSIBLE ID</label>
						<input
							type="text"
							id="respUser"
							name="responsibleUsername"
							placeholder="e.g., rkanihan"
							class="mono"
							required
						/>
					</div>
				</div>

				<button
					type="submit"
					class="submit-btn mono"
					disabled={data.articles.length === 0 || isSubmitting}
				>
					{#if isSubmitting}
						<Spinner /> PROCESSING...
					{:else}
						EXECUTE TICKET GENERATION
					{/if}
				</button>
			</div>
		</div>
	</form>
</div>

<style>
	:root {
		--bg-main: #000000;
		--text-primary: #ffffff;
		--text-secondary: #888888;
		--border: #333333;
		--border-light: #555555;
		--accent: #ceb888; 
		--success: #10b981;
		--error: #ef4444;
	}

	.href-style {
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.mono {
		font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.dashboard-container {
		zoom: 1;

		background-color: var(--bg-main);
		color: var(--text-primary);
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		padding-bottom: 100px; 
		box-sizing: border-box;
	}

	@media screen and (max-width: 1920px) { 
 		.dashboard-container {
			zoom: 0.75;
		}
	}

	@media screen and (min-width: 3840px) {
		.dashboard-container {
			zoom: 1.25;
		}
	}

	.masthead {
		animation: slideFadeDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		padding: 3rem 5% 2rem 5%;
		border-bottom: 1px solid var(--border-light);
	}

	@keyframes slideFadeDown {
		0% {
			opacity: 0;
			transform: translateY(-20px) scale(0.98);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.masthead-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 2rem;
	}

	.masthead h1 {
		font-size: 3.5rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		margin: 0;
		line-height: 0.9;
	}

	.status-indicator {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.85rem;
		color: var(--text-secondary);
	}

	.status-dot {
		width: 10px;
		height: 10px;
		background: var(--text-secondary);
	}
	.status-dot.success { background: var(--success); }
	.status-dot.error { background: var(--error); }

	.masthead-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.masthead-bottom p {
		margin: 0;
		color: var(--text-secondary);
		font-size: 0.9rem;
		letter-spacing: 0.05em;
	}

	.nav-links {
		display: flex;
		gap: 1.5rem;
		font-size: 0.85rem;
	}

	.nav-links a {
		color: var(--text-secondary);
		text-decoration: none;
		transition: color 0.2s;
	}

	.nav-links a:hover {
		color: var(--text-primary);
	}

	.system-message {
		margin: 2rem 5% 0 5%;
		padding: 1rem;
		font-size: 0.85rem;
		border: 1px solid var(--border);
	}
	.msg-success { color: var(--success); border-color: var(--success); }
	.msg-error { color: var(--error); border-color: var(--error); }

	.content-area {
		padding: 2rem 5%;
		flex: 1;
	}

	.ledger {
		padding-top: 0.5rem;
		border-top: 2px solid var(--text-primary);

		padding-left: 0.5rem;
		border-left: 2px solid var(--text-primary);

	}

    .ledger-body {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		
		align-items: stretch;
		gap: 0; 
		
		border-top: 1px solid var(--border-light);
		border-left: 1px solid var(--border-light);
	}

	.action-cell {
		display: block;
		cursor: pointer;
		color: var(--accent);
		background: transparent;
		border: none;
		padding: 0;
		text-align: left;
		font: inherit;
		height: 100%;
		width: 100%;
	}

	.action-cell .cell-content {
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
		min-height: 180px;
		height: 100%;
		box-sizing: border-box;
		border-right: 1px solid var(--border-light);
		border-bottom: 1px solid var(--border-light);
		transition: background-color 0s, color 0s, box-shadow 0s;
	}

	.action-cell:hover .cell-content {
		background-color: #080808;
		box-shadow: inset 0 0 0 1px var(--border-light);
	}

	.action-cell .sharp-checkbox {
		width: 14px;
		height: 14px;
		border: 1px solid var(--border-light);
		display: inline-block;
	}

	.action-cell .sharp-checkbox.is-checked {
		background-color: var(--accent);
		border-color: var(--accent);
	}
	
	.action-cell .cell-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}
	
	.action-cell .col-title {
		font-weight: 700;
		font-size: 1.1rem;
		line-height: 1.4;
		margin-bottom: 1.5rem;
	}
	
	.action-cell .col-due {
		margin-top: auto;
	}

	.empty-state {
		padding: 4rem 0;
		text-align: center;
		color: var(--text-secondary);
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
	}

	.control-panel {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: var(--bg-main);
		border-top: 1px solid var(--border-light);
		z-index: 100;
	}

	.control-inner {
		padding: 1.5rem 5%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.assignments {
		display: flex;
		gap: 2rem;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.input-group label {
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--text-secondary);
	}

	.input-group input {
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--border);
		color: var(--text-primary);
		padding: 0.5rem 0;
		font-size: 0.9rem;
		outline: none;
		transition: border-color 0s;
		width: 200px;
	}

	.input-group input:focus {
		border-bottom-color: var(--accent);
	}

	.input-group input::placeholder {
		color: #ffffff75;
	}

	.submit-btn {
		background: var(--text-primary);
		color: var(--bg-main);
		border: none;
		padding: 1rem 2rem;
		font-size: 0.85rem;
		font-weight: 700;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		transition: background 0.2s, color 0.2s;
	}

	.submit-btn:hover:not(:disabled) {
		background: var(--accent);
	}

	.submit-btn:disabled {
		background: var(--border);
		color: var(--text-secondary);
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.control-inner {
			flex-direction: column;
			gap: 1.5rem;
			align-items: stretch;
		}
		.assignments {
			flex-direction: column;
			gap: 1rem;
		}
		.input-group input { width: 100%; }
		.masthead-top { flex-direction: column; align-items: flex-start; gap: 1rem; }
		.masthead h1 { font-size: 2.5rem; }
		.masthead-bottom { flex-direction: column; align-items: flex-start; gap: 1rem; }
	}
</style>