const getUrlWithProxy = (link) => {
    const url = encodeURIComponent(link);

    const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app/');
    urlWithProxy.searchParams.set('url', url);
    urlWithProxy.searchParams.set('disableCache', 'true');

    console.log(urlWithProxy.toString());

    return urlWithProxy.toString();
};

export default getUrlWithProxy; 