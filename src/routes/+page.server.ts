
import { fail } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
    const token = cookies.get('tdx_token');
    return {
        hasToken: !!token
    };
};

export const actions = {
    saveToken: async ({ request, cookies }) => {
        const data = await request.formData();
        const token = data.get('token');

        if (!token || typeof token !== 'string') {
            return fail(400, { missing: true });
        }

        cookies.set('tdx_token', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 
        });

        return { success: true };
    },
    
    clearToken: async ({ cookies }) => {
        cookies.delete('tdx_token', { path: '/' });
    }
};