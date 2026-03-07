# TeamDynamix KB Automation Dashboard

## Overview
A web application built to streamline and automate the annual Knowledge Base (KB) review process within the Purdue University TeamDynamix (TDX) environment. 

This tool pulls active KB articles that are approaching their review dates and automatically generates the necessary tracking infrastructure in TeamDynamix, mimicking the current manual workflow.

## Current Features (MVP)
* **Automated Data Retrieval:** Queries the Purdue TDX API to fetch "Approved" KB articles with a `ReviewDateUtc` occurring within the next 60 days.
* **Batch Ticket Generation:** Creates a primary Parent Ticket (e.g., "Bimonthly KB Review") to group the review workload.
* **Child Task Automation:** Iterates through selected articles and automatically generates individual review tasks attached to the Parent Ticket.

## Tech Stack
* **Framework:** SvelteKit
* **Language:** TypeScript / HTML / CSS
* **Backend:** Node.js (via SvelteKit Server Routes)
* **Integration:** TeamDynamix REST API

## Local Development Setup

### 1. Prerequisites
* Node.js installed on your local machine.
* An active TeamDynamix browser token (for local testing) or a TDX Web Services Key (Client ID/Secret) for production.

### 2. Installation
Clone the repository and install the required dependencies:
```bash
git clone https://github.com/rkanihan/TDX.git
cd TDX
pnpm install
```

### 3. Authentication Configuration (Local Dev)
Currently, the application uses a manual browser token for local development. 
1. Log into `https://service.purdue.edu`.
2. Navigate to `https://service.purdue.edu/TDWebApi/api/auth/loginsso` to retrieve your active bearer token.
3. Open `.env` at the root of /TDX and paste the token into `TDX_AUTH_TOKEN`. *(Note: This token expires periodically and will need to be refreshed during development).*

### 4. Running the App
Start the SvelteKit development server:
```bash
pnpm run dev
```
Navigate to `http://localhost:5173` in your browser to view the dashboard.

## Project Structure
* `src/routes/+page.svelte`: The frontend UI and dashboard displaying the articles pending review.
* `src/routes/+page.server.ts`: The backend server actions that securely intercept frontend form submissions and trigger the TDX workflows.
* `src/lib/server/tdx.ts`: The core TeamDynamix API utility file handling authentication, payload construction, and fetching.

## Roadmap & Next Steps
* **Production Authentication:** Transition from manual browser tokens to a dedicated TDX Web Services Key (`/auth/loginadmin`) for seamless, background authentication.
* **Automated Approvals:** Add a secondary workflow to mark TDX tasks as complete, approve KB drafts, and automatically push the `NextReviewDate` forward by one year.
