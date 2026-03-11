<svg class="spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
	<circle
		class="spinner-track"
		cx="12"
		cy="12"
		r="10"
		stroke="currentColor"
		stroke-width="3"
	></circle>
	<path
		class="spinner-head"
		d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22"
		stroke="currentColor"
		stroke-width="3"
		stroke-linecap="round"
	></path>
</svg>

<style>
	.spinner {
		width: 20px;
		height: 20px;
		animation: spin 1s linear infinite;
	}

	.spinner-track {
		opacity: 0.2;
	}

	.spinner-head {
		opacity: 1;
		stroke: var(--bg-main);
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>