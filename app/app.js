import LayoutFactory from './layout.js';
import UsageFactory from './usage.js';

const app = Vue.createApp({
    template: '<router-view></router-view>'
});

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: '/', redirect: '/usage' },
        {
            path: '/', component: LayoutFactory, children: [
                { path: '/usage', component: UsageFactory },
            ]
        },
    ],
})

app.use(router)
app.mount('app-root')
