export default {
    baseApi: 'https://openai.tdp.icu/v1/',
    defaultKey: 'key-of-sponsor',

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

        return fetch(this.baseApi + path, opts).then(r => r.json());
    },

    async usage(key) {
        const today = new Date();
        const formatDate = function (timestamp) {
            const date = new Date(timestamp * 1000);
            return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
        };

        const subscription = await this.fetch('dashboard/billing/subscription', null, key);

        const start_date = subscription.hard_limit_usd > 20
            ? [today.getFullYear(), today.getMonth() + 1, '1'].join('-') : formatDate(today / 1000 - 90 * 86400);
        const end_date = formatDate(today / 1000 + 86400);

        const usage = await this.fetch(`dashboard/billing/usage?start_date=${start_date}&end_date=${end_date}`, null, key);

        return {
            access_until: formatDate(subscription.access_until),
            hard_limit_usd: subscription.hard_limit_usd.toFixed(5),
            total_usage: (usage.total_usage / 100).toFixed(5),
            left_quota: (subscription.hard_limit_usd - usage.total_usage / 100).toFixed(5),
            start_date: start_date,
            end_date: end_date,
        };
    }

}