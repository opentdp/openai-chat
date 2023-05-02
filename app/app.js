import Layout from './layout.js';
import Err404 from './err404.js';

import Chat from './chat.js';
import Usage from './usage.js';

const app = Vue.createApp({
    template: '<router-view></router-view>'
});

const routes = [
    { path: '/', redirect: '/chat' },
    {
        path: '/', component: Layout, children: [
            { path: '/chat', name: '聊天', component: Chat },
            { path: '/usage', name: '额度查询', component: Usage },
        ]
    },
    { path: "/:catchAll(.*)", name: "页面未找到", component: Err404 },
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

app.use(router);
app.mount('app-root');
