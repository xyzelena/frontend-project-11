import i18next from 'i18next';
import resources from '../locales/index.js';

import onChangeState from './View.js';

import validateData from './utils/validateData.js';
import { getLinks } from './utils/utils.js';
import getAxiosData from './utils/getAxiosData.js';
import parseData from './utils/parseData.js';
import { throwErrorResponse } from './utils/throwErrors.js'
import createNewFeed from './utils/createNewFeed.js';
import createListPosts from './utils/createListPosts.js';

const app = () => {
    const elements = {
        baseTextUI: {
            header: document.querySelector('h1.display-3.mb-0'),
            leadText: document.querySelector('p.lead'),
            placeholderInput: document.querySelector('#url-input'),
            labelInput: document.querySelector('label.visually-hidden'),
            btnSubmit: document.querySelector('button[type="submit"]'),
            exampleUrl: document.querySelector('p.mt-4.text-secondary'),
            footerText: document.querySelector('#footer>span'),
            footerLink: document.querySelector('#footer>a'),
        },
        form: document.querySelector('.rss-form'),
        fields: {
            input: document.querySelector('#url-input'),
        },
        feedback: document.querySelector('.feedback'),
        feeds: document.querySelector('.feeds'),
        posts: document.querySelector('.posts'),
        modalWindow: {
            modal: document.getElementById('modal'),
        },
    };

    const form = elements.form;
    const input = elements.fields.input;
    const modal = elements.modalWindow.modal;

    const STATUS = {
        IDLE: 'idle',
        LOADING: 'loading',
        SUCCESS: 'success',
        FAIL: 'fail',
    };

    const initialState = {
        UI: {
            loadingBaseUI: STATUS.IDLE,
        },
        rssForm: {
            valid: STATUS.IDLE,
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

    const defaultLanguage = 'ru';

    const i18nInstance = i18next.createInstance();

    i18nInstance
        .init({
            lng: defaultLanguage,
            debug: false,
            resources,
        })
        .then(() => {

            const watchedState = onChangeState(initialState, elements, i18nInstance);

            watchedState.UI.loadingBaseUI = STATUS.SUCCESS;

            form.addEventListener('submit', (e) => {
                e.preventDefault();

                watchedState.rssForm.fields.url = input.value.trim();

                const postsLinks = getLinks(Object.values(watchedState.loadedPosts.posts));

                const feedsLinks = getLinks(watchedState.loadedFeeds.feeds);

                const processingUrl = validateData(watchedState.rssForm.fields, feedsLinks);

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

                        watchedState.rssForm.valid = STATUS.SUCCESS;
                    })

                    .catch((err) => {
                        // const e = Object.entries(err);
                        // console.log(e);
                        // console.log(err.name);
                        //console.log(err.inner[0].type);

                        if (err.name === 'ValidationError') {
                            watchedState.rssForm.error = err.inner[0].type;
                        } else {
                            watchedState.rssForm.error = err.message;
                        }

                        watchedState.rssForm.valid = STATUS.FAIL;
                    });
            });

            modal.addEventListener('show.bs.modal', (e) => {
                // Button that triggered the modal
                const btnWatchPost = e.relatedTarget;

                // Extract info from data-* attributes
                const idBtnWatchPost = btnWatchPost.getAttribute('data-id');

                // Update the modal's content
                watchedState.interface.idCurrentWatchedPost = idBtnWatchPost;

                //Update watched posts
                const idWatchedPosts = watchedState.interface.idWatchedPosts;
                if (idWatchedPosts.indexOf(idBtnWatchPost) === -1) idWatchedPosts.push(idBtnWatchPost);
            });

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

        }); //end then i18nInstance
};

export default app;


