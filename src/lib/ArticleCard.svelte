<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { Article } from '$lib/server/tdx';

	export let article: Article;
	export let i: number;

	function formatReadableDate(utcString: string) {
		const date = new Date(utcString);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<label class="article-card" in:fly|global={{ y: 50, duration: 600, delay: i * 50 }}>
	<input type="checkbox" name="articleIds" value={article.ID} checked />
	<div class="card-inner">
		<div class="card-header">
			<span class="article-id">ID {article.ID}</span>
			<span class="due-date">Due: {formatReadableDate(article.ReviewDateUtc as string)}</span>
		</div>
		<h3 class="article-title">{article.Subject}</h3>
		<div class="custom-checkbox">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
				<polyline points="20 6 9 17 4 12"></polyline>
			</svg>
		</div>
	</div>
</label>

<style>
	.article-card {
		cursor: pointer;
		display: block;
		position: relative;
	}

	.article-card input[type='checkbox'] {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.card-inner {
		background: var(--card-bg);
		border: 2px solid var(--border);
		border-radius: 12px;
		padding: 1.5rem;
		height: 100%;
		box-sizing: border-box;
		transition: all 0.2s ease;
		position: relative;
		overflow: hidden;
	}

	.article-card:hover .card-inner {
		border-color: #475569;
		transform: translateY(-2px);
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
	}

	.article-card input[type='checkbox']:checked + .card-inner {
		border-color: var(--accent);
		background: linear-gradient(145deg, var(--card-bg) 0%, var(--accent-glow) 100%);
		box-shadow: 0 0 20px var(--accent-glow);
	}

	.article-card input[type='checkbox']:focus-visible + .card-inner {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
	}

	.custom-checkbox {
		position: absolute;
		bottom: 1.5rem;
		right: 1.5rem;
		width: 24px;
		height: 24px;
		border-radius: 6px;
		border: 2px solid #475569;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.custom-checkbox svg {
		width: 14px;
		height: 14px;
		stroke: var(--bg-main);
		opacity: 0;
		transform: scale(0.5);
		transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.article-card input[type='checkbox']:checked + .card-inner .custom-checkbox {
		background: var(--accent);
		border-color: var(--accent);
	}

	.article-card input[type='checkbox']:checked + .card-inner .custom-checkbox svg {
		opacity: 1;
		transform: scale(1);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.75rem;
		font-size: 0.875rem;
		color: var(--text-secondary);
		font-weight: 500;
	}

	.article-id {
		background: var(--bg-main);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		color: var(--accent);
	}

	.article-title {
		margin: 0 0 2rem 0;
		font-size: 1.1rem;
		line-height: 1.5;
		font-weight: 600;
		padding-right: 2rem; /* checkbox overlap */
	}
</style>
