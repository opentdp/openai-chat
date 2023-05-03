import openai from './openai.js';

export default async () => {

    const tpl = await fetch('app/chat.html').then(res => res.text());

    return {
        data() {
            return {
                items: [],
                error: '',
                message: '',
                loading: false,
                avatars: {
                    bot: 'assets/images/icon.svg',
                    user: 'assets/images/avatar.jpg',
                },
            };
        },
        methods: {
            async submit() {
                this.error = ''
                this.loading = true
                this.items.push({ role: 'user', content: this.message })
                this.message = '' // 清空输入框内的消息，防止重复发送
                const item = await openai.chat(this.items).finally(() => this.loading = false)
                if (item && item.role && item.content) {
                    item.content = marked.parse(item.content)
                    this.items.push(item)
                }
            },
            clear() {
                this.items = []
            }
        },
        template: tpl,
    };

}