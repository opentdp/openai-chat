/**
 * @auther Rehiy
 * @url https://www.rehiy.com/post/500
 * @description storage.get('keys') 为存储的key列表，每行一个key
 */

function header_cors() {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'OPTIONS',
    };
    return new Response(null, { headers });
}

async function openai_key(request, storage) {
    let auth = request.headers.get('Authorization');

    if (auth == 'Bearer sk-of-opentdp-sponsor') {
        const keys = await storage.get('keys');
        if (keys) {
            const keylist = keys.trim().split('\n');
            const sortkey = Math.floor(Math.random() * keylist.length);
            auth = 'Bearer ' + keylist[sortkey];
        }
    }

    return auth;
}

async function openai_proxy(request, storage) {
    const url = new URL(request.url);
    const auth = await openai_key(request, storage);
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
            return header_cors();
        }
        return openai_proxy(request, env.storage);
    }
}
