import * as yup from 'yup';
import i18next from 'i18next';
import resources from '../locales/index.js';
import axios from 'axios';
import onChangeState from './View.js';
import short from 'short-uuid';
import { parseData } from './utilities.js';
//import _ from 'lodash';

const app = () => {

    const defaultLanguage = 'ru';

    const i18nInstance = i18next.createInstance();

    i18nInstance
        .init({
            lng: defaultLanguage,
            debug: false,
            resources,
        })
        .then(function (t) { t('key'); });

    const elements = {
        form: document.querySelector('.rss-form'),
        fields: {
            input: document.querySelector('.form-control'),
        },
        feedback: document.querySelector('.feedback'),
        submit: document.querySelector('button[type="submit"]'),
        posts: document.querySelector('.posts'),
        feeds: document.querySelector('.feeds'),
    };

    const input = elements.fields.input;

    const initialState = {
        rssForm: {
            valid: 'idle',
            fields: {
                url: '',
            },
            error: null,
        },
        loadedFeeds: {
            feeds: [],
        },
        loadedContent: {
            posts: [],
        },
        // interface:{}, 
    };

    const watchedState = onChangeState(initialState, elements, i18nInstance);

    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const url = input.value.trim();

        watchedState.rssForm.fields.url = url;

        const feedsLinks = watchedState.loadedFeeds.feeds.map(feed => feed.link);

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

        const validateStatus = schema
            .validate(watchedState.rssForm.fields, { abortEarly: false })
            .then(() => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`))
            .then((response) => {

                const rawContents = response.data.contents;

                if (rawContents === '') {
                    throw new ReferenceError('noDataContents');
                }

                // const parser = new DOMParser();

                // const parsedData = parser.parseFromString(rawContents, "text/xml");

                const parsedData = parseData(rawContents); 

                const titleFeed = parsedData.querySelector('title').textContent;
                const descriptionFeed = parsedData.querySelector('description').textContent;

                const newFeed = {
                    id: short.generate(),
                    title: titleFeed,
                    description: descriptionFeed,
                    link: url,
                };

                const items = [...parsedData.querySelectorAll('item')];

                const newPosts = items.map((item) => {
                    const titlePost = item.querySelector('title').textContent;
                    const descriptionPost = item.querySelector('description').textContent;
                    const linkPost = item.querySelector('link').textContent;

                    return {
                        id: short.generate(),
                        idFeed: newFeed.id,
                        title: titlePost,
                        description: descriptionPost,
                        link: linkPost,
                    };
                });

                watchedState.loadedFeeds.feeds.unshift(newFeed); 

                watchedState.loadedContent.posts = [...newPosts, ...watchedState.loadedContent.posts];

                watchedState.rssForm.error = null;

                watchedState.rssForm.valid = true;

            })
            .catch((err) => {
                // Как сделать иначе. Теперь любая ошибка в коде указывает на err.inner[0].type

                if (err instanceof ReferenceError) {
                    watchedState.rssForm.error = err.message;
                } else {
                    watchedState.rssForm.error = err.inner[0].type;
                }
                // const keysError = Object.entries(err); 
                // //['value', 'path', 'type', 'errors', 'params', 'inner', 'name', 'message']

                //watchedState.rssForm.error = err.inner[0].type ?? err.message; //почему не работает ??? 

                watchedState.rssForm.valid = false;
            });

    });//end addEventListener
};

export default app;


