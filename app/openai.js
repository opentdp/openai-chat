export default {
    baseApi: 'https://api.tdp.icu/openai/v1',
    defaultKey: 'sk-of-opentdp-sponsor',

    async fetch(path, body, key) {
        key = key || this.defaultKey;

        const opts = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + key,
            },
        }

        if (body != null) {
            opts.method = 'POST';
            opts.body = JSON.stringify(body);
        }

        return fetch(this.baseApi + path, opts).then(async r => {
            const data = await r.json();
            if (!r.ok) {
                if (data && data.error) {
                    throw new Error(data.error.message);
                }
                throw new Error(r.statusText || '请求失败');
            }
            return data;
        })
    },

    async chat(messages, model, key) {
        const data = { model: model || 'gpt-3.5-turbo-16k', messages };
        const resp = await this.fetch('/chat/completions', data, key);

        return resp.choices[0].message;
    },

    async usage(key) {
        const today = new Date();
        const formatDate = function (timestamp) {
            const date = new Date(timestamp * 1000);
            return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
        };

        const subscription = await this.fetch('/dashboard/billing/subscription', null, key);

        const start_date = subscription.hard_limit_usd > 20
            ? [today.getFullYear(), today.getMonth() + 1, '1'].join('-') : formatDate(today / 1000 - 90 * 86400);
        const end_date = formatDate(today / 1000 + 86400);

        const usage = await this.fetch(`/dashboard/billing/usage?start_date=${start_date}&end_date=${end_date}`, null, key);

        const models_obj = await this.fetch('/models', null, key);
        const models_gpt = models_obj.data.filter(m => m.id.startsWith('gpt-')).map(m => m.id);

        return {
            access_until: formatDate(subscription.access_until),
            hard_limit_usd: subscription.hard_limit_usd.toFixed(5),
            total_usage: (usage.total_usage / 100).toFixed(5),
            left_quota: (subscription.hard_limit_usd - usage.total_usage / 100).toFixed(5),
            start_date: start_date,
            end_date: end_date,
            models_gpt,
        };
    }

}