import openai from './openai.js';

export default async () => {

    const tpl = await fetch('app/usage.html').then(res => res.text());

    return {
        data() {
            return {
                items: [],
                message: '',
                validkeys: [],
                placeholder: '请输入 API-KEY，必须包含 sk-，多个可直接粘贴'
            };
        },
        methods: {
            async submit() {
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
                    if (res.left_quota > 0) {
                        this.validkeys.push(item.key);
                    }
                    Object.assign(item, res);
                });
            },
            async clear() {
                const text = this.validkeys.join('\n');
                if (this.message != text) {
                    this.message = text;
                    throw new Error('清理完成');
                }
                throw new Error('无需清理');
            },
        },
        template: tpl,
    };

}