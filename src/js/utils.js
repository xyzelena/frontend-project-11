import axios from 'axios';
import short from 'short-uuid';

export const getLinks = (arr) => arr.map(arr => arr.link);

export const getAxiosData = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);

export const parseData = (rawContents) => {
    const parser = new DOMParser();

    const parsedData = parser.parseFromString(rawContents, "text/xml");

    return parsedData;
};

export const throwErrorResponse = (statusResponse) => {
    if (statusResponse >= 400 && statusResponse < 500) {
        throw new Error('noDataContents');
    } else if (statusResponse >= 500 && statusResponse < 600) {
        throw new Error('networkError');
    }
    else return;
};

export const createNewFeed = (doc, url) => {
    const titleFeed = doc.querySelector('title').textContent;
    const descriptionFeed = doc.querySelector('description').textContent;

    const newFeed = {
        id: short.generate(),
        title: titleFeed,
        description: descriptionFeed,
        link: url,
    };

    return newFeed;
};

const findAllPosts = (doc, idFeed) => {
    const items = [...doc.querySelectorAll('item')];

    const posts = items.map((item) => {
        const titlePost = item.querySelector('title').textContent;
        const descriptionPost = item.querySelector('description').textContent;
        const linkPost = item.querySelector('link').textContent;

        const post = {
            id: short.generate(),
            idFeed,
            title: titlePost,
            description: descriptionPost,
            link: linkPost,
        };

        return post;
    });

    return posts;
};

export const createListPosts = (doc, idFeed, postsLinks) => {
    const newPosts = findAllPosts(doc, idFeed);

    if (postsLinks.length === 0) return newPosts;

    const uniqPosts = newPosts.filter(({ link }) => !postsLinks.includes(link));

    return uniqPosts;
};

