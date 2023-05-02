export default async () => {

    const tpl = await fetch('app/err404.html').then(res => res.text());

    return {
        template: tpl,
    };

}