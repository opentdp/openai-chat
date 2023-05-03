export default async () => {

    const tpl = await fetch('app/layout.html').then(res => res.text());

    return {
        data() {
            return {
                messages: [],
            };
        },
        created() {
            window.addEventListener("unhandledrejection", event => {
                event.preventDefault && event.preventDefault()
                this.createMessage(event.reason)
            })
        },
        methods: {
            createMessage(message) {
                this.messages.push({ index: Date.now(), content: message })
            },
            removeMessage(index) {
                this.messages = this.messages.filter(m => m.index !== index)
            }
        },
        template: tpl,
    };

}