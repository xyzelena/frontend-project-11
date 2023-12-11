import * as yup from 'yup';
import i18next from 'i18next';
import resources from '../locales/index.js';
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

        yup.setLocale({
            // use constant translation keys for messages without values
            mixed: {
                url: 'ValidationError',
                required: 'urlRequired',
                notOneOf: 'TypeError',
                default: 'fieldInvalid',
            },
        });

        const schema = yup.object().shape({
            url: yup.string()
                .url('url must be correct')
                .required('url must be required')
                .notOneOf(feeds, 'url must be uniq'),
                // .url()
                // .required()
                // .notOneOf(feeds, ''),
        });

        const validateStatus = schema
            .validate(watchedState.rssForm.fields, { abortEarly: false })
            .then(() => {
                watchedState.rssForm.feeds.push(url);
                watchedState.rssForm.valid = true;
            })
            .catch((err) => {
                // const keys = Object.entries(err); 
                //console.log(err.name); 
                //['value', 'path', 'type', 'errors', 'params', 'inner', 'name', 'message']

                watchedState.rssForm.error = err.name;

                watchedState.rssForm.valid = false;
            });

    });//end addEventListener

};

export default app;


