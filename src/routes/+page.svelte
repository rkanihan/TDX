<script lang="ts">
    import { onMount } from 'svelte';
    import type { PageData, ActionData } from './$types';
    import { enhance } from '$app/forms';
    import { fly } from 'svelte/transition';

    export let data: PageData;
    export let form: ActionData;

    let isSubmitting = false;

    let mounted = false;

    onMount(() => {
        mounted = true;
    });

    function formatReadableDate(utcString: string) {
        const date = new Date(utcString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }
</script>

<div class="dashboard-container">
    <div class="diagonal-bg-container">
        <div class="glow top-glow"></div>
        <div class="glow bottom-glow"></div>
        
        <div class="panel p1"></div>
        <div class="panel p2"></div>
        <div class="panel p3"></div>
        <div class="panel p4"></div>
        <div class="panel p5"></div>
        <div class="panel p6"></div>

        <div class="vignette"></div>
    </div>
    <header class="hero">
        <div class="header-left">
            <div class="header-content">
            <div class="title-wrapper">
                <div class="title-accent-line"></div>
                <h1>TDX KB Automation</h1>
            </div>
            <p>Generate parent tickets and review tasks for articles with upcoming deadlines.</p>
        </div>
            <div class="status-badge {form?.success ? 'success pulse' : form?.message ? 'error' : ''}">
                <div class="dot"></div>
                {#if form?.success}
                    Success
                {:else if form?.message}
                    Error
                {:else}
                    Idle
                {/if}
            </div>
        </div>

        <div class="header-actions">
            <a href="https://github.com/rkanihan/TDX" target="_blank" rel="noopener noreferrer" class="icon-link" aria-label="GitHub Repository">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
            </a>

            <a href="https://service.purdue.edu/TDNext/Home/Desktop/Default.aspx" target="_blank" rel="noopener noreferrer" class="icon-link" aria-label="TDX Ticketing App">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                    <path d="M13 5v2"></path>
                    <path d="M13 17v2"></path>
                    <path d="M13 11v2"></path>
                </svg>
            </a>

            <a href="https://service.purdue.edu/TDWebApi/" target="_blank" rel="noopener noreferrer" class="icon-link" aria-label="TDX API Docs">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
            </a>
        </div>
    </header>

    {#if form?.success}
        <div class="toast success-toast">{form.message}</div>
    {:else if form?.message}
        <div class="toast error-toast">{form.message}</div>
    {/if}

    <form method="POST" action="?/startReview" class="automation-form" use:enhance={() => {
        isSubmitting = true;

        return async ({ update }) => {
            await update();
            isSubmitting = false;
        };
    }}>
        <main class="content-area">
            {#if data.articles.length === 0}
                <div class="empty-state">
                    <h2>You're all caught up!</h2>
                    <p>No articles are currently due for review within the next 60 days.</p>
                </div>
            {:else}
                <div class="article-grid">
                    
                    {#if mounted}
                        {#each data.articles as article, i (article.ID)}
                            
                            <label 
                                class="article-card"
                                in:fly|global={{ y: 50, duration: 600, delay: i * 50 }} 
                            >
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
                            
                        {/each}
                    {/if}
                    
                </div>
            {/if}
        </main>

        <div class="floating-action-bar">
            <div class="assignments">
                <div class="input-group">
                    <label for="reqUser">Requestor</label>
                    <input type="text" id="reqUser" name="requestorUsername" placeholder="e.g., guy13" required />
                </div>
                <div class="input-group">
                    <label for="respUser">Responsible</label>
                    <input type="text" id="respUser" name="responsibleUsername" placeholder="e.g., rkanihan" required />
                </div>
            </div>
            
            <button type="submit" class="submit-btn" disabled={data.articles.length === 0 || isSubmitting}>
                {#if isSubmitting}
                    <svg class="spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
                        <path class="spinner-head" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
                    </svg>
                    Generating...
                {:else}
                    Generate Ticket
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                {/if}
            </button>
        </div>
    </form>
</div>

<style>
    /* Purdue Colors */
    :root {
        --bg-main: #0B0F15;
        --card-bg: #151A22;
        --card-hover: #1E2530;
        --accent: #CEB888; /* Gold */
        --accent-glow: rgba(206, 184, 136, 0.15);
        --text-primary: #F8FAFC;
        --text-secondary: #94A3B8;
        --border: #2A3241;
        --success: #10B981;
        --error: #EF4444;
    }

    /* Global Typography */
    :global(body) {
        margin: 0;
        background-color: var(--bg-main);
        color: var(--text-primary);
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    .dashboard-container {
        /* inter device (prob not necessary) */
        min-height: 100dvh; 
        display: flex;
        flex-direction: column;
        padding-bottom: 160px; /* space for the floating bar */
    }

    .hero {
        padding: 3rem 5%;
        background: linear-gradient(to bottom, rgba(206,184,136,0.05) 0%, transparent 100%);
        display: flex;
        justify-content: space-between;
        align-items: center; 
        border-bottom: 1px solid var(--border);
        flex-wrap: wrap; 
        gap: 2rem;
    }

    .header-left {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1.5rem;
    }

    .header-actions {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .icon-link {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 12px;
        color: var(--text-secondary);
        background: var(--card-bg);
        border: 1px solid var(--border);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        text-decoration: none;
    }

    .icon-link svg {
        width: 22px;
        height: 22px;
        transition: transform 0.3s ease;
    }

    .icon-link:hover {
        color: var(--accent);
        border-color: var(--accent);
        background: rgba(206, 184, 136, 0.1);
        transform: translateY(-4px);
        box-shadow: 0 8px 16px var(--accent-glow);
    }

    .icon-link:hover svg {
        transform: scale(1.1);
    }

    .icon-link::after {
        content: attr(aria-label);
        position: absolute;
        bottom: -35px;
        left: 50%;
        transform: translateX(-50%) translateY(10px);
        opacity: 0;
        background: var(--card-bg);
        border: 1px solid var(--border);
        color: var(--text-primary);
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        white-space: nowrap;
        pointer-events: none;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10;
    }

    .icon-link:hover::after {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }

    .header-content {
        animation: slideFadeDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
        transform: translateY(-15px);
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

    .title-wrapper {
        display: flex;
        align-items: center;
        gap: 1.25rem;
        margin-bottom: 0.75rem;
    }

    .title-accent-line {
        width: 6px;
        height: 2.75rem;
        background: linear-gradient(to bottom, var(--accent), #A38D63);
        border-radius: 8px;
        box-shadow: 0 0 20px var(--accent-glow);
    }

    .header-content h1 {
        margin: 0;
        font-size: 3.25rem;
        font-weight: 800;
        letter-spacing: -0.06rem;
        line-height: 1;
        
        background: linear-gradient(135deg, #FFFFFF 0%, var(--accent) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        
        filter: drop-shadow(0 4px 15px rgba(206, 184, 136, 0.15));
    }

    .header-content p {
        margin: 0 0 0 1.6rem; 
        color: var(--text-secondary);
        font-size: 1.15rem;
        letter-spacing: 0.02em;
        font-weight: 400;
        max-width: 600px;
        line-height: 1.5;
    }

    .status-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--card-bg);
        padding: 0.5rem 1rem;
        border-radius: 99px;
        font-size: 0.875rem;
        font-weight: 500;
        border: 1px solid var(--border);
    }

    .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--text-secondary);
    }
    .success .dot { background: var(--success); }
    .error .dot { background: var(--error); }
    .pulse { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); animation: pulse 2s infinite; }
    
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
        100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    /* article grid area */
    .content-area {
        padding: 2rem 5%;
        max-width: 1600px;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
    }

    .article-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
    }

    .article-card {
        cursor: pointer;
        display: block;
        position: relative;
    }

    .article-card input[type="checkbox"] {
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
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }

    .article-card input[type="checkbox"]:checked + .card-inner {
        border-color: var(--accent);
        background: linear-gradient(145deg, var(--card-bg) 0%, var(--accent-glow) 100%);
        box-shadow: 0 0 20px var(--accent-glow);
    }

    .custom-checkbox {
        position: absolute;
        bottom: 1.5rem;
        right: 1.5rem;
        width: 24px;
        height: 24px;
        border-radius: 6px;
        border: 2px solid var(--border);
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

    .article-card input[type="checkbox"]:checked + .card-inner .custom-checkbox {
        background: var(--accent);
        border-color: var(--accent);
    }

    .article-card input[type="checkbox"]:checked + .card-inner .custom-checkbox svg {
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

    .floating-action-bar {
        position: fixed;
        bottom: 2rem;
        left: 5%;
        right: 5%;
        max-width: 1200px;
        margin: 0 auto;
        background: rgba(21, 26, 34, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 1.25rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        z-index: 100;
    }

    .assignments {
        display: flex;
        gap: 1.5rem;
        flex: 1;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        width: 100%;
        max-width: 250px;
    }

    .input-group label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-secondary);
        font-weight: 600;
    }

    .input-group input {
        background: var(--bg-main);
        border: 1px solid var(--border);
        color: white;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-size: 1rem;
        outline: none;
        transition: border-color 0.2s ease;
    }

    .input-group input:focus {
        border-color: var(--accent);
    }

    .submit-btn {
        background: var(--text-primary);
        color: var(--bg-main);
        border: none;
        padding: 0.875rem 2rem;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transition: all 0.2s ease;
        margin-left: 2rem;
    }

    .submit-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        background: var(--accent);
        box-shadow: 0 10px 20px var(--accent-glow);
    }

    .submit-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .submit-btn svg {
        width: 20px;
        height: 20px;
        transition: transform 0.2s ease;
    }

    .submit-btn:hover:not(:disabled) svg {
        transform: translateX(4px);
    }

    .toast {
        margin: 2rem 5% 0 5%;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    }

    .success-toast { background: rgba(16, 185, 129, 0.1); border: 1px solid var(--success); color: var(--success); }
    .error-toast { background: rgba(239, 68, 68, 0.1); border: 1px solid var(--error); color: var(--error); }

    .empty-state {
        text-align: center;
        padding: 4rem;
        color: var(--text-secondary);
    }

    @keyframes slideIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* mobile (ya prob don't really need this lol) */
    @media (max-width: 768px) {
        .floating-action-bar {
            flex-direction: column;
            gap: 1.5rem;
            padding: 1.5rem;
        }
        .assignments {
            flex-direction: column;
            width: 100%;
        }
        .input-group { max-width: 100%; }
        .submit-btn { width: 100%; justify-content: center; margin-left: 0; }
        .hero { flex-direction: column; gap: 1rem; }
    }

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

    .diagonal-bg-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #000000; 
        overflow: hidden;
        z-index: -1;
        pointer-events: none;
    }

    .glow {
        position: absolute;
        border-radius: 50%;
        filter: blur(100px);
        opacity: 0.85; 
    }

    .top-glow {
        top: -15%;
        left: -15%;
        width: 60vw;
        height: 60vw;
        background: #0000cc; 
        animation: pulseGlow 8s infinite alternate ease-in-out;
    }

    .bottom-glow {
        bottom: -20%;
        right: -15%;
        width: 70vw;
        height: 70vw;
        background: #000066; 
        animation: pulseGlow 12s infinite alternate-reverse ease-in-out;
    }

    @keyframes pulseGlow {
        0% { transform: scale(1) translate(0, 0); opacity: 0.5; }
        100% { transform: scale(1.2) translate(5%, 5%); opacity: 1; }
    }
    
    .panel {
        position: absolute;
        width: 200vw;
        height: 18vh;
        
        background: linear-gradient(180deg, rgba(0, 10, 80, 0.9) 0%, rgba(0, 0, 0, 1) 100%);
        transform: rotate(-30deg);
        
        box-shadow: 0 -30px 60px rgba(0, 0, 0, 1), inset 0 2px 4px rgba(80, 80, 255, 0.3);
    }

    .p1 { top: -25vh; left: -60vw; animation: pShift 12s infinite alternate ease-in-out; }
    .p2 { top: -2vh;  left: -40vw; animation: pShift 16s infinite alternate-reverse ease-in-out; }
    .p3 { top: 22vh;  left: -70vw; animation: pShift 14s infinite alternate ease-in-out; }
    .p4 { top: 48vh;  left: -50vw; animation: pShift 18s infinite alternate-reverse ease-in-out; }
    .p5 { top: 75vh;  left: -80vw; animation: pShift 10s infinite alternate ease-in-out; }
    .p6 { top: 105vh; left: -45vw; animation: pShift 15s infinite alternate-reverse ease-in-out; }

    @keyframes pShift {
        0% { transform: rotate(-30deg) translate(0, 0); }
        100% { transform: rotate(-30deg) translate(-8%, -80px); }
    }

    .vignette {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: linear-gradient(
            45deg, 
            rgba(0,0,0,1) 10%, 
            rgba(0,0,0,0) 47%, 
            rgba(0,0,0,0) 53%, 
            rgba(0,0,0,1) 85%
        );
        z-index: 2; 
    }
</style>