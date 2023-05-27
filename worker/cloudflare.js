/**
 * @auther Rehiy
 * @url https://github.com/open-tdp/openai-chat
 */

const GITHUB_URL = 'https://raw.githubusercontent.com/open-tdp/openai-chat/master';

async function github_proxy(request) {
    const url = new URL(request.url);

    let backend = GITHUB_URL + url.pathname;
    if (url.pathname.endsWith('/')) {
        backend += 'index.html';
    }

    const res = await fetch(backend, {
        method: request.method,
        headers: {
            'User-Agent': request.headers.get('User-Agent'),
        },
    });

    const headers = new Headers();
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
        'json': 'application/json',
        'js': 'application/javascript',
        'css': 'text/css',
        'xml': 'text/xml',
        'html': 'text/html',
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

// esmodule

export default {
    async fetch(request, env) {
        return github_proxy(request);
    }
}
