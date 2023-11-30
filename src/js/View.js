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

const renderErrors = (input, newError, valid) => {
    const nextEl = input.nextElementSibling;

    if (nextEl !== null) {
        nextEl.textContent = newError;
        return;
    }

    const newFeedbackElement = document.createElement('div');
    newFeedbackElement.classList.add('invalid-feedback');
    newFeedbackElement.textContent = newError;
    input.after(newFeedbackElement);
};

// Представление не меняет модель.
// По сути, в представлении происходит отображение модели на страницу
// Для оптимизации рендер происходит точечно в зависимости от того, какая часть модели изменилась
// Функция возвращает функцию. 
const render = (input, valid) => (path, value, prevValue) => {
    switch (path) {
        case 'rssForm.valid':
            renderValid(input, value, prevValue);
            break;

        case 'rssForm.error':
            renderErrors(input, value);
            break;

        default:
            break;
    }
};

const onChangeState = (state, input) => onChange(state, render(input, state.rssForm.valid)); 

export default onChangeState; 