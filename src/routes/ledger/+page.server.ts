
import { initiateKbReview, getArticlesDueForReview } from '$lib/server/tdx';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {    
    const token = cookies.get('tdx_token');

    if (!token) {
        throw redirect(303, '/'); 
    }

    const articles = await getArticlesDueForReview(token);

    return { articles };
}

export const actions: Actions = {
    startReview: async ({ request, cookies }: { request: Request; cookies: import('@sveltejs/kit').Cookies }) => {
        const token = cookies.get('tdx_token');
        const data = await request.formData();
        const articles = data.getAll('articleIds') as string[];
        const requestorUsername = data.get('requestorUsername') as string;
        const responsibleUsername = data.get('responsibleUsername') as string;

        if (!token) {
            throw redirect(303, '/');
        }
        
        if (!articles || articles.length === 0) {
            return { success: false, message: "No articles selected." };
        }

        const result = await initiateKbReview(articles, requestorUsername, responsibleUsername, token);
        return result;
    }
};
