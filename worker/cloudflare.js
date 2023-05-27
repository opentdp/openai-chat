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
    headers.set('Cache-Control', 'public, max-age=86400');
    header_content_type(headers, url.pathname);

    return new Response(res.body, {
        status: res.status,
        headers,
    });
}

function header_content_type(headers, pathname) {
    const ext = pathname.split('.').pop();
    switch (ext) {
        case 'json':
            headers.set('Content-Type', 'application/json');
            break;
        case 'js':
            headers.set('Content-Type', 'application/javascript');
            break;
        case 'css':
            headers.set('Content-Type', 'text/css');
            break;
        case 'xml':
            headers.set('Content-Type', 'text/xml');
            break;
        case 'html':
            headers.set('Content-Type', 'text/html');
            break;
        case 'webm':
            headers.set('Content-Type', 'video/webm');
            break;
        case 'mp3':
            headers.set('Content-Type', 'audio/mpeg');
            break;
        case 'mp4':
            headers.set('Content-Type', 'video/mp4');
            break;
        case 'webp':
            headers.set('Content-Type', 'image/webp');
            break;
        case 'gif':
            headers.set('Content-Type', 'image/gif');
            break;
        case 'png':
            headers.set('Content-Type', 'image/png');
            break;
        case 'jpg':
        case 'jpeg':
            headers.set('Content-Type', 'image/jpeg');
            break;
        case 'svg':
            headers.set('Content-Type', 'image/svg+xml');
            break;
        case 'ico':
            headers.set('Content-Type', 'image/x-icon');
            break;
        case 'txt':
            headers.set('Content-Type', 'text/plain');
            break;
    }
}

// esmodule

export default {
    async fetch(request, env) {
        return github_proxy(request);
    }
}
