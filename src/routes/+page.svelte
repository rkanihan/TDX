<script lang="ts">
    import type { PageData, ActionData } from './$types';

    export let data: PageData;
    export let form: ActionData;
</script>

<h1>TeamDynamix KB Automation Dashboard</h1>

{#if form?.success}
    <p style="color: green; font-weight: bold;">{form.message}</p>
{:else if form?.message}
    <p style="color: red; font-weight: bold;">{form.message}</p>
{/if}

<section>
    <h2>Generate KB Review Tickets</h2>
    <p>The following articles have an upcoming review date. Select the articles you wish to generate review tasks for.</p>
    
    <form method="POST" action="?/startReview">
        {#if data.articles.length === 0}
            <p><em>No articles are currently due for review within the next 60 days.</em></p>
        {:else}
            <div style="margin-bottom: 1rem;">
                {#each data.articles as article (article.ID)}
                    <label style="display: block; margin-bottom: 0.5rem;">
                        <input type="checkbox" name="articleIds" value={article.ID} checked /> 
                        <strong>ID {article.ID}:</strong> {article.Title} 
                        <em>(Due: {new Date(article.NextReviewDate).toLocaleDateString()})</em>
                    </label>
                {/each}
            </div>
            <button type="submit" style="padding: 0.5rem 1rem; cursor: pointer;">
                Create Parent Ticket & Tasks
            </button>
        {/if}
    </form>
</section>