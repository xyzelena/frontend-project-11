import * as yup from 'yup';
import i18next from 'i18next';
import resources from '../locales/index.js';
import axios from 'axios';
import onChangeState from './View.js';
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
        submit: document.querySelector('button[type="submit"]'),
    };

    const input = elements.fields.input;

    const initialState = {
        rssForm: {
            valid: true,
            fields: {
                url: '',
            },
            error: '',
            feeds: [],
        },
    };

    const watchedState = onChangeState(initialState, input, i18nInstance);

    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const url = input.value.trim();

        watchedState.rssForm.fields.url = url;

        const feeds = Object.values(watchedState.rssForm.feeds);

        // const feeds_1= watchedState.rssForm.feeds;

        // console.log(feeds_1);

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
                .notOneOf(feeds, 'url must be uniq'),
        });

        const validateStatus = schema
            .validate(watchedState.rssForm.fields, { abortEarly: false })
            .then(() => {

                axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
                .then(function (response) {
                  // handle success
                  console.log(response);
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                })
                .finally(function () {
                  // always executed
                });

                // fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
                //     .then(response => {
                //         if (response.ok) return response.json();
                //         else {
                //             watchedState.rssForm.error = 'networkError';
                //         }
                //         //throw new Error('Network response was not ok.');
                //     })
                //     // .then(data => console.log(data.contents));

                //     .then(data => {

                //         const parser = new DOMParser();
                //         const doc = parser.parseFromString(stringContainingXMLSource, data.contents);

                //         console.log(doc);

                //         const post = {
                //             id: watchedState.rssForm.feeds.length + 1,
                //             title: data.contents.title,
                //             description: data.contents.description,
                //         };

                //         watchedState.rssForm.feeds.push(post);

                //         watchedState.rssForm.valid = true;
                //     });


                // watchedState.rssForm.feeds.push(url);
                // watchedState.rssForm.valid = true;
            })
            .catch((err) => {
                // const keys = Object.entries(err); 
                //['value', 'path', 'type', 'errors', 'params', 'inner', 'name', 'message']

                watchedState.rssForm.error = err.inner[0].type;

                watchedState.rssForm.valid = false;
            });

    });//end addEventListener

};

export default app;


