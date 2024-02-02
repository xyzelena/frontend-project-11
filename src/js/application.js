import * as yup from 'yup';
import i18next from 'i18next';

import resources from '../locales/index.js';

import onChangeState from './View.js';

import { getLinks } from './utils/utils.js';
import getAxiosData from './utils/getAxiosData.js';
import parseData from './utils/parseData.js';
import { throwErrorResponse } from './utils/throwErrors.js'
import createNewFeed from './utils/createNewFeed.js';
import createListPosts from './utils/createListPosts.js';

const app = () => {

    const defaultLanguage = 'ru';

    const i18nInstance = i18next.createInstance();

    i18nInstance
        .init({
            lng: defaultLanguage,
            debug: false,
            resources,
        })
    // .then(function (t) { t('key'); }); // ????????????

    const elements = {
        form: document.querySelector('.rss-form'),
        fields: {
            input: document.querySelector('.form-control'),
        },
        feedback: document.querySelector('.feedback'),
        feeds: document.querySelector('.feeds'),
        posts: document.querySelector('.posts'),
        modal: {
            modal: document.getElementById('modal'),
        },
    };

    const input = elements.fields.input;

    const initialState = {
        rssForm: {
            valid: 'idle',
            fields: {
                url: null,
            },
            error: null,
        },
        loadedFeeds: {
            feeds: [],
        },
        loadedPosts: {
            posts: [],
        },
        interface: {
            idCurrentWatchedPost: null,
            idWatchedPosts: [],
        },
    };

    const watchedState = onChangeState(initialState, elements, i18nInstance);

    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const url = input.value.trim();

        watchedState.rssForm.fields.url = url;

        const feedsLinks = getLinks(watchedState.loadedFeeds.feeds);

        const postsLinks = getLinks(Object.values(watchedState.loadedPosts.posts));

        yup.setLocale({
            // use constant translation keys for messages without values
            mixed: {
                url: 'url',
                required: 'required',
                notOneOf: 'notOneOf',
                default: 'fieldInvalid',
            },
        });

        const schema = yup.object().shape({
            url: yup.string()
                .url('url must be correct')
                .required('url must be required')
                .notOneOf(feedsLinks, 'url must be uniq'),
        });

        const processingUrl = new Promise((resolve) => {
            resolve(schema.validate(watchedState.rssForm.fields, { abortEarly: false }));
        })

        processingUrl
            .then((resolvedValue) =>
                new Promise((resolve) => {
                    resolve(getAxiosData(resolvedValue.url));
                }))

            .then((response) => {
                const statusResponse = response.data.status.http_code;

                throwErrorResponse(statusResponse);

                const parsedData = parseData(response.data.contents);

                const newFeed = createNewFeed(parsedData, url);

                const listPosts = createListPosts(parsedData, newFeed.id, postsLinks);


                watchedState.loadedFeeds.feeds.unshift(newFeed);

                watchedState.loadedPosts.posts = [...listPosts, ...watchedState.loadedPosts.posts];

                watchedState.rssForm.error = null;

                watchedState.rssForm.valid = true;
            })

            .catch((err) => {
                if (err instanceof yup.ValidationError) {
                    watchedState.rssForm.error = err.inner[0].type;
                } else {
                    watchedState.rssForm.error = err.message;
                }

                watchedState.rssForm.valid = false;
            });
    });//end form.addEventListener

    const updateListPosts = () => {

        const feeds = watchedState.loadedFeeds.feeds;

        const postsLinks = getLinks(Object.values(watchedState.loadedPosts.posts));

        if (feeds.length !== 0) {

            const result = feeds.forEach(({ id, link }) => {

                const processingLink = new Promise((resolve) => {
                    resolve(getAxiosData(link));
                });

                processingLink
                    .then((response) => {
                        const statusResponse = response.data.status.http_code;

                        throwErrorResponse(statusResponse);

                        const parsedData = parseData(response.data.contents);

                        const listPosts = createListPosts(parsedData, id, postsLinks);

                        watchedState.loadedPosts.posts = [...listPosts, ...watchedState.loadedPosts.posts];

                    })
                    .catch((err) => {
                        return false;
                    });

            }); // end forEach feedsLinks 

        }//end if empty feedsLinks 

        setTimeout(updateListPosts, 5000); // 5000
    };

    updateListPosts();
};

export default app;


