const createUrl = (link) => {
    const url = new URL(link);

    return `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
};

export default createUrl; 