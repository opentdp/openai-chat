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
                const item = await this.chatbot().catch(e => this.error = e).finally(() => this.loading = false)
                if (item && item.role && item.content) {
                    this.items.push(item)
                    this.message = ''
                }
            },
            async chatbot() {
                const data = { model: 'gpt-3.5-turbo', messages: this.items }
                const resp = await openai.fetch('chat/completions', data)
                return resp.choices[0].message
            },
            clear() {
                this.items = []
            }
        },
        template: tpl,
    };

}