const TDX_API_BASE_URL = "https://service.purdue.edu/TDWebApi/api";
const TICKET_TYPE_ID = 8;
const TICKET_FORM_ID = 6;
const ACCOUNT_ID = 1;
const STATUS_ID = 77;
const PRIORITY_ID = 19; 
const IMPACT_ID = 12;
const URGENCY_ID = 16;
const SlaID = 0;
const EstimatedMinutes = 60;
const StartDate = new Date().toISOString();
const EndDate = new Date(new Date().setDate(new Date().getDate() + 60)).toISOString(); 


async function getAuthToken() {

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InJrYW5paGFuQHB1cmR1ZS5lZHUiLCJ0ZHhfZW50aXR5IjoiMiIsInRkeF9wYXJ0aXRpb24iOiIzMDU3IiwibmJmIjoxNzcyOTAwNjE5LCJleHAiOjE3NzI5ODcwMTksImlhdCI6MTc3MjkwMDYxOSwiaXNzIjoiVEQiLCJhdWQiOiJodHRwczovL3d3dy50ZWFtZHluYW1peC5jb20vIn0.GueCUbpjGlE47yYhCNHT3lmG1cirwrnSsEj-CnILe_I"; 
    
    return token;
}

async function fetchTdx(endpoint: string, method: string, body?: Record<string, unknown>) {
    const token = await getAuthToken();
    
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

export async function getArticlesDueForReview() {
    try {
        const searchPayload = { 
            Status: 3,
            ReturnCount: 10000,
            IncludeArticleBodies: false,
            IncludeShortcuts: false,
        };

        const results = await fetchTdx('/knowledgebase/search', 'POST', searchPayload);

        console.log("\n--- NUM OF RESULTS ---");
        console.log(results.length);
        console.log("----------------------\n");

        const prunedResults = await pruneArticles(results);

        console.log("\n--- NUM OF PRUNED RESULTS ---");
        console.log(prunedResults.length);
        console.log("-----------------------------\n");

        return prunedResults || [];
    } catch (error) {
        console.error("Error fetching articles:", error);
        return [];
    }
}

export async function initiateKbReview(articleIds: string[], requestorUsername: string, responsibleUsername: string) {
    try {
        const requestorUid = await getGUIDFromUsername(requestorUsername);
        const responsibleUid = await getGUIDFromUsername(responsibleUsername);

        if (!requestorUid) throw new Error(`Invalid Requestor Username: ${requestorUsername}`);
        if (!responsibleUid) throw new Error(`Invalid Responsible Username: ${responsibleUsername}`);

        // Create the Ticket
        const ticketPayload = {
            TypeID: TICKET_TYPE_ID,
            FormID: TICKET_FORM_ID,
            Title: `Bimonthly KB Review - ${new Date().toLocaleDateString()}`,
            Description: 'This ticket is to track the revisions beiung made in CSS articles that have their eview date expiring between the below dates:<br><br>' +
                `${new Date().toLocaleDateString()} and ${new Date(new Date().setDate(new Date().getDate() + 60)).toLocaleDateString()}<br><br>` +
                'Please make sure to update the articles with the latest information and mark the task as complete once done.&nbsp;',
            AccountId: ACCOUNT_ID,
            StatusId: STATUS_ID,
            PriorityId: PRIORITY_ID,
            RequestorUid: requestorUid,
            ResponsibleUid: responsibleUid,
            ImpactId: IMPACT_ID,
            UrgencyId: URGENCY_ID,
            SlaID: SlaID,
            EstimatedMinutes: EstimatedMinutes,
            StartDate: StartDate,
            EndDate: EndDate
        };

        const ticket = await fetchTdx('/tickets', 'POST', ticketPayload);
        const parentTicketId = ticket.ID;

        // Create tasks for each article 
        for (const articleId of articleIds) {
            const taskPayload = {
                Title: `Review KB Article ${articleId}`,
                Description: `Link to KB Article: https://service.purdue.edu/TDClient/32/Purdue/KB/ArticleDet?ID=${articleId}<br><br>` +
                    'Ongoing Notes:<br> Please put notes here.&nbsp;',
                AccountId: ACCOUNT_ID,
                EstimatedMinutes: EstimatedMinutes,
                ResponsibleGroupId: 19
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

export async function findMyAppIds() {
    try {
        const apps = await fetchTdx('/applications', 'GET', undefined);
        
        console.log("\n--- RAW TEAMDYNAMIX APP DATA ---");
        if (Array.isArray(apps)) {
            const App = apps.find(app => app.AppClass == 'TDNext');
            
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

export async function pruneArticles(articles: Record<string, unknown>[]) {
    const sixtyDaysFromNow = new Date();
    sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);

    const targetGroups = ['IT_CSS_PWL_ADMIN_SUPPORT', 'IT_CSS_PWL_APP_ADMIN'];
    
    const filteredArticles = articles.filter(article => {

        const groupName = article.OwningGroupName as string;
        const isTargetGroup = targetGroups.includes(groupName);

        const reviewDateString = article.ReviewDateUtc as string;

        if (!reviewDateString || !isTargetGroup) {
            return false;
        }

        const reviewDate = new Date(reviewDateString);
        const isDueForReview = reviewDate < sixtyDaysFromNow;

        return isDueForReview;
    });

    return filteredArticles.sort((a, b) => {
        const dateA = new Date(a.ReviewDateUtc as string).setHours(0, 0, 0, 0);
        const dateB = new Date(b.ReviewDateUtc as string).setHours(0, 0, 0, 0);
        
        if (dateA === dateB) {
            return (a.ID as number) - (b.ID as number);
        }
        return dateA - dateB;
    });
}

export async function getGUIDFromUsername(username: string) {
    try {
        const GUID = await fetchTdx(`/people/getuid/${encodeURIComponent(username)}`, 'GET', undefined);

        console.log(`GUID for ${username}: ${GUID}`);

        return GUID;
    } catch (error) {
        console.error("Error fetching user GUID:", error);
        return null;
    }
}

export async function getTicket(ticketId: number) {
    try { 
        const ticket = await fetchTdx(`/tickets/${ticketId}`, 'GET', undefined);

        console.log(`Fetched ticket #${ticketId}:`, ticket);

        return ticket;
    } catch (error) {
        console.error("Error fetching ticket:", error);
        return null;
    }
}
