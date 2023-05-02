/**
 * @auther Rehiy
 * @url https://www.rehiy.com/post/500
 * @description env.storage.get('keys') 为存储的key列表，每行一个key
 */

// openai usage

async function openai_get(api, key) {
    const resp = await fetch('https://api.openai.com/v1' + api, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + key,
        },
    });
    return resp.json();
}

async function openai_usage(key) {
    const today = new Date();
    const formatDate = function (timestamp) {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const subscription = await openai_get('/dashboard/billing/subscription', key);

    let start_date = 0;
    if (subscription.hard_limit_usd > 20) {
        start_date = [today.getFullYear(), today.getMonth() + 1, '1'].join('-');
    } else {
        start_date = formatDate(today / 1000 - 90 * 86400);
    }
    const end_date = formatDate(today / 1000 + 86400);

    const usage = await openai_get(`/dashboard/billing/usage?start_date=${start_date}&end_date=${end_date}`, key);

    return new Response(JSON.stringify({
        access_until: formatDate(subscription.access_until),
        hard_limit_usd: subscription.hard_limit_usd.toFixed(5),
        total_usage: (usage.total_usage / 100).toFixed(5),
        left_quota: (subscription.hard_limit_usd - usage.total_usage / 100).toFixed(5),
        start_date: start_date,
        end_date: end_date,
    }));
}

// openai proxy

async function openai_authkey(request, env) {
    let auth = request.headers.get('Authorization');

    if (auth == 'Bearer key-of-sponsor') {
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
    const auth = await openai_authkey(request, env);
    const backend = request.url.replace(url.host, 'api.openai.com');
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

        const url = new URL(request.url);

        if (url.pathname.startsWith('/v1/')) {
            return openai_proxy(request, env);
        }

        if (url.pathname.startsWith('/usage/')) {
            const res = url.pathname.match(/^\/usage\/(.+)$/);
            return openai_usage(res[1]);
        }

        return fetch(request);
    }
}