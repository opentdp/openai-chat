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
                authkey: 'key-of-sponsor'
            };
        },
        methods: {
            async submit() {
                this.error = ''
                this.loading = true
                this.items.push({ role: 'user', content: this.message })
                const item = await this.chatbot().finally(() => this.loading = false).catch(e => this.error = e)
                this.items.push(item)
                this.message = ''
            },
            async chatbot() {
                const opts = {
                    method: 'POST',
                    headers: { Authorization: 'Bearer ' + this.authkey },
                    body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: this.items }),
                }
                const resp = await fetch('/v1/chat/completions', opts).then(res => res.json())
                return resp.choices[0].message
            },
            clear() {
                this.items = []
            }
        },
        template: tpl,
    };

}