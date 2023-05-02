export default async () => {

    const tpl = await fetch('app/usage.html').then(res => res.text());

    return {
        data() {
            return {
                items: [],
                message: '',
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
                            status: '查询中...',
                        });
                    }
                });
                // 获取余额
                this.items.forEach(async item => {
                    const res = await fetch('/usage/' + item.key).then(res => res.json()).catch(() => {
                        item.status = '查询失败';
                    });
                    Object.assign(item, res);
                });
            },
        },
        template: tpl,
    };

}