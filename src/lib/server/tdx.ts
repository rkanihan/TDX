const TDX_API_BASE_URL = "https://service.purdue.edu/TDWebApi/api";


const TICKET_TYPE_ID = 12345; 
const TICKET_FORM_ID = 67890;
const REQUESTOR_UID = "00000000-0000-0000-0000-000000000000"; 

interface TdxApplication {
    ID: number;
    Name: string;
    ApplicationTypeName: string;
}

async function getAuthToken(ssoPayload?: Record<string, unknown>) {
    
    const myTemporaryToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InJrYW5paGFuQHB1cmR1ZS5lZHUiLCJ0ZHhfZW50aXR5IjoiMiIsInRkeF9wYXJ0aXRpb24iOiIzMDU3IiwibmJmIjoxNzcyNjgxMDIwLCJleHAiOjE3NzI3Njc0MjAsImlhdCI6MTc3MjY4MTAyMCwiaXNzIjoiVEQiLCJhdWQiOiJodHRwczovL3d3dy50ZWFtZHluYW1peC5jb20vIn0._yLg41ZK6hQNlmvCxF2M23ZcCAjVDSk5vu-rD4sWacc"; 
    
    return myTemporaryToken;

    /*
    const res = await fetch(`${TDX_API_BASE_URL}/auth/loginsso`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: ssoPayload ? JSON.stringify(ssoPayload) : undefined
    });
    
    if (!res.ok) throw new Error('Failed to authenticate with TeamDynamix SSO');
    return res.text();
    */
    
}

async function fetchTdx(endpoint: string, method: string, body?: Record<string, unknown>, ssoPayload?: Record<string, unknown>) {
    const token = await getAuthToken(ssoPayload);
    
    const res = await fetch(`${TDX_API_BASE_URL}${endpoint}`, {
        method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`TDX API Error on ${method} ${endpoint}: ${err}`);
    }
    
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

export async function getArticlesDueForReview(ssoPayload?: Record<string, unknown>) {
    try {
        const sixtyDaysFromNow = new Date();
        sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);

        const searchPayload = {
            StatusID: 1, // 1 is typically "Approved" in TDX
            NextReviewDateTo: sixtyDaysFromNow.toISOString()
        };

        const results = await fetchTdx('/knowledgebase/search', 'POST', searchPayload, ssoPayload);
        return results || [];
    } catch (error) {
        console.error("Error fetching articles:", error);
        return [];
    }
}

export async function initiateKbReview(articleIds: string[]) {
    try {
        // Create the Parent Ticket
        const parentTicketPayload = {
            TypeID: TICKET_TYPE_ID,
            FormID: TICKET_FORM_ID,
            Title: `Annual KB Review - ${new Date().getFullYear()}`,
            Description: "Parent ticket for the annual review of Knowledge Base articles.",
            RequestorUid: REQUESTOR_UID,
        };

        const ticket = await fetchTdx('/tickets', 'POST', parentTicketPayload);
        const parentTicketId = ticket.ID;

        // Create tasks for each article 
        for (const articleId of articleIds) {
            const taskPayload = {
                Title: `Review KB Article ${articleId}`,
                Description: `Please review article ID ${articleId} for accuracy.`,
                IsProjectTask: false
            };

            await fetchTdx(`/tickets/${parentTicketId}/tasks`, 'POST', taskPayload);
        }

        return { success: true, message: `Created parent ticket #${parentTicketId} with ${articleIds.length} review tasks.` };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(error);
        return { success: false, message };
    }
}

export async function findMyAppIds(ssoPayload?: any) {
    try {
        const apps = await fetchTdx('/applications', 'GET', undefined, ssoPayload);
        
        console.log("\n--- RAW TEAMDYNAMIX APP DATA ---");
        if (Array.isArray(apps)) {
            const App = apps.find(app => app.Name === 'Knowledge Base');
            
            if (App) {
                console.log(App);
            } else {
                console.log("Knowledge Base app not found in the list.");
            }
        }
        console.log("--------------------------------\n");
        
        return apps;
    } catch (error) {
        console.error("Error fetching applications:", error);
    }
}