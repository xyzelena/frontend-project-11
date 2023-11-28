import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';


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
            status: 'idle', // по умолчанию простой 
            fields: {
                url: '',
            },
            errors: {},
            feeds: [],
        },
    };

    const watchedState = onChange(initialState, (path, value) => {
        if (path === 'rssForm.status') {
            switch (value) {
                case 'invalid': {
                    // Отрисовка ошибок, хранящихся в состоянии errors
                    const errors = watchedState.rssForm.errors;
                    console.log(watchedState.rssForm.errors); 

                    input.classList.add('is-invalid');

                    const nextEl = input.nextElementSibling;

                    // если элемент является последним в своём род узле
                    if (nextEl === null) {
                        const errorDiv = document.createElement('div');
                        errorDiv.classList.add('invalid-feedback');
                        errorDiv.innerHTML = errors;
                        input.after(errorDiv);
                    }

                    break;
                }

                case 'valid': {
                    //удалить ошибки 
                    elements.fields.input.classList.remove('is-invalid');

                    document.querySelectorAll('invalid-feedback')
                        .forEach(elem => elem.remove());

                    break;
                }

                // case 'failed': { // проблема с сетью 
                //     break; 
                //   }

                // case 'finished': {
                //     break; 
                //   }

                default:
                    throw new Error(`Error in ${value}!`);
            }//end switch 
        }//end if path 
    });//end watchedState 

    const schema = yup.object().shape({
        url: yup.string()
            .url('url must be correct')
            .required('url must be required')
            .notOneOf(watchedState.rssForm.feeds, 'url must be uniq'),
    });


    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        watchedState.rssForm.fields.url = elements.fields.input.value;

        const validateStatus = schema
            .validate(watchedState.rssForm.fields, { abortEarly: false })
            .then(() => {
                watchedState.rssForm.status = 'valid';
                watchedState.rssForm.feeds.push(elements.fields.input.value); 
                console.log(watchedState.rssForm.feeds); 
            })
            .catch((error) => {
                //console.log('[error]', error);
                watchedState.rssForm.status = 'invalid';
                watchedState.rssForm.errors = error.errors[0];
                console.log(watchedState.rssForm.errors); 
            });

    });//end addEventListener

};

export default app;


