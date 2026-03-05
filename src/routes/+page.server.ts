
import { initiateKbReview, getArticlesDueForReview, findMyAppIds } from '$lib/server/tdx';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    
    await findMyAppIds();
    
    const articles = await getArticlesDueForReview();
    
    return {
        articles
    };
}

export const actions: Actions = {
    startReview: async ({ request }) => {
        const data = await request.formData();
        const articles = data.getAll('articleIds') as string[]; 
        
        if (!articles || articles.length === 0) {
            return { success: false, message: "No articles selected." };
        }

        const result = await initiateKbReview(articles);
        return result;
    }
};
