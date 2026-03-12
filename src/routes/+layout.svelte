<script lang="ts">
	let { children } = $props();
</script>

<style>
	:global(body) {
		margin: 0;
		background-color: #050505;
		padding: 0;
	}
</style>

{@render children()}
