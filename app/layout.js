export default async () => {

    const tpl = await fetch('app/layout.html').then(res => res.text());

    return {
        data() {
            return {
                messages: [],
            };
        },
        created() {
            window.addEventListener("unhandledrejection", e => {
                this.createMessage({ content: e.reason, type: 'error' });
                e.preventDefault && e.preventDefault();
            })
            window.addEventListener('message', e => {
                e.data.content && this.createMessage(e.data);
            });
        },
        methods: {
            createMessage(data) {
                this.messages.push({
                    index: Date.now(), type: 'success', ...data
                });
            },
            removeMessage(idx) {
                this.messages = this.messages.filter(m => m.index !== idx);
            }
        },
        template: tpl,
    };

}