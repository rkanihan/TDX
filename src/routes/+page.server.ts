
import { initiateKbReview, getArticlesDueForReview } from '$lib/server/tdx';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {    
    const articles = await getArticlesDueForReview();
    
    return {
        articles
    };
}

export const actions: Actions = {
    startReview: async ({ request }: { request: Request }) => {
        const data = await request.formData();
        const articles = data.getAll('articleIds') as string[];
        const requestorUsername = data.get('requestorUsername') as string;
        const responsibleUsername = data.get('responsibleUsername') as string;
        
        if (!articles || articles.length === 0) {
            return { success: false, message: "No articles selected." };
        }

        const result = await initiateKbReview(articles, requestorUsername, responsibleUsername);
        return result;
    }
};
