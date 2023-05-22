/**
 * @auther Rehiy
 * @url https://www.rehiy.com/post/500
 * @description env.storage.get('keys') 为存储的key列表，每行一个key
 */

async function openai_key(request, env) {
    let auth = request.headers.get('Authorization');

    if (auth == 'Bearer sk-of-opentdp-sponsor') {
        const keys = await env.storage.get('keys');
        if (keys) {
            const keylist = keys.trim().split('\n');
            const sortkey = Math.floor(Math.random() * keylist.length);
            auth = 'Bearer ' + keylist[sortkey];
        }
    }

    return auth;
}

async function openai_proxy(request, env) {
    const url = new URL(request.url);
    const auth = await openai_key(request, env);
    const backend = request.url
        .replace('/openai/v1/', '/v1/')
        .replace(url.host, 'api.openai.com');
    const payload = {
        method: request.method,
        headers: { Authorization: auth },
    };

    if (request.body) {
        payload.body = await request.text();
        payload.headers['Content-Type'] = 'application/json';
    }

    return fetch(backend, payload);
}

// esmodule

export default {
    async fetch(request, env) {
        if (request.method === 'OPTIONS') {
            const corsHeaders = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS',
                'Access-Control-Allow-Headers': '*',
            };
            return new Response(null, { headers: corsHeaders });
        }
        return openai_proxy(request, env);
    }
}