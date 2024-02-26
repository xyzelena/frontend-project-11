const getUrlWithProxy = (url) => {
    const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app/');
    urlWithProxy.searchParams.set('disableCache', 'true');
    urlWithProxy.searchParams.set('url', url);
    return urlWithProxy.toString();
};

export default getUrlWithProxy;

// Documentation: https://github.com/Hexlet/hexlet-allorigins