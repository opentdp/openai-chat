import openai from './openai.js';

export default async () => {

    const tpl = await fetch('app/usage.html').then(res => res.text());

    return {
        data() {
            return {
                items: [],
                message: '',
                placeholder: '请输入 API-KEY，必须包含 sk-，多个可直接粘贴'
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
                            models_gpt: [],
                            latest_gpt: '',
                            status: '查询中...',
                        });
                    }
                });
                // 获取余额
                this.items.forEach(async item => {
                    const res = await openai.usage(item.key).catch(() => {
                        item.status = '查询失败';
                    });
                    Object.assign(item, res);
                });
            },
            clear() {
                this.items = this.items.filter(item => {
                    return item.left_quota && item.left_quota > 0;
                });
                this.message = this.items.map(item => item.key).join('\n');
                postMessage({ content: '清理完成' });
            },
        },
        template: tpl,
    };

}