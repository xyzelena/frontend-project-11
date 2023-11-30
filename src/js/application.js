import * as yup from 'yup';
import onChangeState from './View.js';
//import _ from 'lodash';

const app = () => {
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

    const watchedState = onChangeState(initialState,input);

    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const url = input.value.trim(); 

        watchedState.rssForm.fields.url = url;

        const feeds = Object.values(watchedState.rssForm.feeds);

        const schema = yup.object().shape({
            url: yup.string()
                .url('url must be correct')
                .required('url must be required')
                .notOneOf(feeds, 'url must be uniq'),
        });

        const validateStatus = schema
            .validate(watchedState.rssForm.fields, { abortEarly: false })
            .then(() => {
                watchedState.rssForm.feeds.push(url);
                watchedState.rssForm.valid = true;
            })
            .catch((error) => {
                watchedState.rssForm.error = error.message;
                watchedState.rssForm.valid = false;
            });

    });//end addEventListener

};

export default app;


