/**
 * 静态仓库托管 for EdgeOne Workers
 * @url https://github.com/opentdp/openai-chat
 * @author Rehiy
 */

const BACKEND_PREFIX = 'https://raw.githubusercontent.com/opentdp/openai-chat/master';

async function github_proxy(request) {
    const uObj = new URL(request.url);

    let backend = BACKEND_PREFIX + uObj.pathname;
    if (backend.endsWith('/')) {
        backend += 'index.html';
    }

    const res = await fetch(backend, {
        method: request.method,
        headers: {
            'User-Agent': request.headers.get('User-Agent'),
        },
        eo: {
            cacheKey: backend,
        }
    });

    const headers = new Headers();
    headers.set('Backend-Url', backend);
    headers.set('Content-Type', file_type(backend));
    headers.set('Cache-Control', 'public, max-age=86400');

    return new Response(res.body, {
        status: res.status,
        headers,
    });
}

function file_type(url) {
    const ext = url.split('?').shift().split('.').pop();
    const mines = {
        'json': 'application/json; charset=utf-8',
        'js': 'application/javascript; charset=utf-8',
        'css': 'text/css; charset=utf-8',
        'xml': 'text/xml; charset=utf-8',
        'html': 'text/html; charset=utf-8',
        'webm': 'video/webm',
        'mp3': 'audio/mpeg',
        'mp4': 'video/mp4',
        'webp': 'image/webp',
        'gif': 'image/gif',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'svg': 'image/svg+xml',
        'ico': 'image/x-icon',
    };
    return mines[ext] || 'text/plain';
}

// eo listener

addEventListener('fetch', event => {
    const response = github_proxy(event.request);;
    event.respondWith(response);
});
