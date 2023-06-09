import openai from './openai.js';

export default async () => {

    const tpl = await fetch('app/usage.html').then(res => res.text());

    return {
        data() {
            return {
                items: [],
                message: '',
                validkeys: [],
            };
        },
        methods: {
            submit() {
                this.items = [];
                // 获取密钥
                this.message.split('\n').forEach(key => {
                    if (key.indexOf('sk-') !== -1) {
                        this.items.push({
                            key: key,
                            mask: key.replace(/(sk-.{5}).+(.{5})/, '$1****$2'),
                            access_until: '',
                            hard_limit_usd: '',
                            total_usage: '',
                            left_quota: '',
                            model_gpt3: '-',
                            model_gpt4: '-',
                            status: '查询中...',
                        });
                    }
                });
                // 获取余额
                this.items.forEach(async item => {
                    const res = await openai.usage(item.key).catch(() => {
                        item.status = '查询失败';
                    });
                    if (res.status != '查询失败') {
                        this.validkeys.push(item.key);
                    }
                    Object.assign(item, res);
                });
            },
            copy() {
                const text = this.validkeys.join('\n');
                const element = createElement(text);
                element.select();
                element.setSelectionRange(0, element.value.length);
                document.execCommand('copy');
                element.remove();
            },
        },
        template: tpl,
    };

}