<script lang="ts">
	import type { Article } from '$lib/server/tdx';
	import { fly } from 'svelte/transition';

	export let article: Article;
	export let i: number;
	export let selectedIds: number[];
	export let columns: number;

	$: gridPosition = i + 1; 
	$: row = Math.floor(gridPosition / columns);
	$: col = gridPosition % columns;
	$: distance = row + col;

	function formatReadableDate(utcString: string) {
		const date = new Date(utcString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		}).replace(/\//g, '.'); 
	}

	function normalizeCreatedBy(name: string) {
		return name.trim();
	}
</script>

<label class="article-cell" in:fly|global={{ y: 50, duration: 600, delay: distance * 60 }}>
	<input type="checkbox" name="articleIds" value={article.ID} bind:group={selectedIds} />
	
	<div class="cell-content">
		<div class="cell-top">
			<div class="sharp-checkbox"></div>
			<div class="col-id mono">{article.ID}</div>
		</div>
		
		<div class="col-title">{article.Subject}</div>

		<div class="col-name mono">{normalizeCreatedBy(article.CreatedFullName)}</div>
		
		<div class="col-due mono">DUE: {formatReadableDate(article.ReviewDateUtc as string)}</div>
	</div>
</label>

<style>
	.article-cell {
		display: block;
		cursor: pointer;
		color: var(--text-secondary);
		height: 100%;
	}

	.article-cell input {
		display: none;
	}

	.cell-content {
		display: flex;
		flex-direction: column;
		padding: 1.2rem;
		min-height: 180px; 
		box-sizing: border-box;
		height: 100%;

		border-right: 1px solid var(--border-light);
		border-bottom: 1px solid var(--border-light);
		
		transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
	}

	.cell-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.8rem;
	}

	.article-cell:hover .cell-content {
		background-color: #080808; 
		color: var(--text-primary);
		box-shadow: inset 0 0 0 1px var(--border-light); 
	}

	input:checked + .cell-content {
		color: var(--text-primary);
		box-shadow: inset 0 0 0 2px var(--accent);
	}

	.sharp-checkbox {
		width: 14px;
		height: 14px;
		border: 1px solid var(--border-light);
		display: inline-block;
	}

	input:checked + .cell-content .sharp-checkbox {
		background-color: var(--accent);
		border-color: var(--accent);
	}

	.mono {
		font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
		font-size: 0.80rem;
		letter-spacing: 0.05em;
	}

	.col-title {
		font-weight: 500;
		font-size: 1.1rem;
		line-height: 1.4;
		margin-bottom: 0.8rem;
		white-space: normal; 
	}

	.col-name {
		margin-top: auto;
		margin-bottom: 0.8rem; 
	}
	
	.col-due {
		margin-top: auto; 
	}
</style>