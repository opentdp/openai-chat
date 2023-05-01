export default async () => {

    const tpl = await fetch('app/layout.html').then(res => res.text());

    return {
        data() {
            return {
                title: 'OpenAI API 余额查询',
            };
        },
        template: tpl,
    };

}