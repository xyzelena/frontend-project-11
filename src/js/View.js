import onChange from 'on-change';

const renderValid = (input, value, prevValue) => {
    if (value) {
        if (!prevValue) {
            input.classList.remove('is-invalid');
            input.nextElementSibling.remove();
        }

        input.value = '';
        input.focus();
    } else {
        if(prevValue){
            input.classList.add('is-invalid');
        }        
    }
};

const renderErrors = (input, keyError, i18n) => {
    const error = i18n.t(`mistakes.${keyError}`);

    const nextEl = input.nextElementSibling;

    if (nextEl !== null) {
        nextEl.textContent = error; 
        return;
    }

    const newFeedbackElement = document.createElement('div');
    newFeedbackElement.classList.add('invalid-feedback');
    newFeedbackElement.textContent = error;
    input.after(newFeedbackElement);
};

// Представление не меняет модель.
// По сути, в представлении происходит отображение модели на страницу
const render = (input, valid, i18n) => (path, value, prevValue) => {
    switch (path) {
        case 'rssForm.valid':
            renderValid(input, value, prevValue);
            break;

        case 'rssForm.error':
            renderErrors(input, value, i18n);
            break;

        default:
            break;
    }
};

const onChangeState = (state, input, i18n) => onChange(state, render(input, state.rssForm.valid, i18n)); 

export default onChangeState; 