import onChange from 'on-change';

const renderValidStatusRssForm = (elements, value) => {
    const input = elements.fields.input;
    const feedback = elements.feedback;

    if (value === true) {
        input.classList.remove('is-invalid');
        feedback.classList.remove('invalid-feedback');

        input.classList.add('is-valid');
        feedback.classList.add('valid-feedback');

        input.value = '';
        input.focus();
    } else if (value === false) {
        input.classList.remove('is-valid');
        feedback.classList.remove('valid-feedback');

        input.classList.add('is-invalid');
        feedback.classList.add('invalid-feedback');
    } else if (value === 'idle') {
        input.classList.remove('is-invalid', 'is-valid');
        feedback.classList.remove('invalid-feedback', 'valid-feedback');

        feedback.textContent = '';
    }
};

const renderErrorsRssForm = (elements, value, i18n) => {
    const feedback = elements.feedback;

    if (value !== null) {
        const error = i18n.t(`mistakes.${value}`);
        feedback.textContent = error;
    }
};

const renderFeedbackLoadedFeeds = (elements, i18n) => {
    const feedback = elements.feedback;
    feedback.textContent = i18n.t('confirmation.loaded');
};

const renderListFeeds = (elements, value, i18n) => {
    const listFeeds = elements.feeds;
    listFeeds.textContent = '';

    const divCard = document.createElement('div');
    divCard.classList.add('card', 'border-0');

    const divCardBody = document.createElement('div');
    divCardBody.classList.add('card-body');

    const titleCardBody = document.createElement('h2');
    titleCardBody.classList.add('card-title', 'h-4');
    titleCardBody.textContent = i18n.t('titles.feeds');
    divCardBody.appendChild(titleCardBody);

    divCard.appendChild(divCardBody);

    const ulCard = document.createElement('ul');
    ulCard.classList.add('list-group', 'list-group-flush', 'border-0', 'rounded-0');

    value.map(({ title, description }) => {
        const liCard = document.createElement('li');
        liCard.classList.add('list-group-item', 'border-0', 'border-end-0');

        const titleFeed = document.createElement('h3');
        titleFeed.classList.add('h6', 'm-0');
        titleFeed.textContent = title;
        liCard.appendChild(titleFeed);

        const descriptionFeed = document.createElement('p');
        descriptionFeed.classList.add('small', 'm-0', 'text-black-50');
        descriptionFeed.textContent = description;
        liCard.appendChild(descriptionFeed);

        ulCard.appendChild(liCard);
    });

    divCard.appendChild(ulCard);
    listFeeds.appendChild(divCard);
};

// Modal 
const createModalWindow = (id, title, description, link, i18n) => {
    const divModal = document.createElement('div');
    divModal.classList.add('modal', 'fade');
    divModal.setAttribute('id', 'modal');
    divModal.setAttribute('tabindex', '-1');
    divModal.setAttribute('aria-labelledby', 'modal');
    divModal.setAttribute('aria-hidden', 'true');

    const divModalDialog = document.createElement('div');
    divModalDialog.classList.add('modal-dialog');

    const divModalContent = document.createElement('div');
    divModalContent.classList.add('modal-content');

    //////////////////////////

    const divModalHeader = document.createElement('div');
    divModalHeader.classList.add('modal-header');

    const modalTitle = document.createElement('h5');
    modalTitle.classList.add('modal-title');
    modalTitle.textContent = title;
    divModalHeader.appendChild(modalTitle);

    const btnClose = document.createElement('button');
    btnClose.setAttribute('type', 'button');
    btnClose.classList.add('btn-close', 'close');
    btnClose.dataset.bsDismiss = "modal";
    btnClose.setAttribute('aria-label', 'Close');
    divModalHeader.appendChild(btnClose);

    divModalContent.appendChild(divModalHeader);

    //////////////////////////

    const divModalBody = document.createElement('div');
    divModalBody.classList.add('modal-body');

    const descrModalBody = document.createElement('p');
    descrModalBody.textContent = description;
    divModalBody.appendChild(descrModalBody);

    divModalContent.appendChild(divModalBody);

    //////////////////////////

    const divModalFooter = document.createElement('div');
    divModalFooter.classList.add('modal-footer');

    const btnRead = document.createElement('a'); // open link 
    btnRead.setAttribute('href', link);
    // btnRead.dataset.id = id;
    btnRead.classList.add('btn', 'btn-primary', 'full-article');
    btnRead.setAttribute('target', '_blank');
    btnRead.setAttribute('rel', 'noopener noreferrer');
    btnRead.setAttribute('role', 'button');
    btnRead.textContent = i18n.t('modal.watchLink');
    divModalFooter.appendChild(btnRead);

    const btnShut = document.createElement('button');
    btnShut.setAttribute('type', 'button');
    btnShut.classList.add('btn', 'btn-secondary');
    btnShut.dataset.bsDismiss = "modal";
    btnShut.textContent = i18n.t('modal.shutModal');
    divModalFooter.appendChild(btnShut);

    divModalContent.appendChild(divModalFooter);

    //////////////////////////

    divModalDialog.appendChild(divModalContent);
    divModal.appendChild(divModalDialog);

    return divModal;
};

const renderListPosts = (elements, value, i18n) => {
    const listPosts = elements.posts;
    listPosts.textContent = '';

    const divCard = document.createElement('div');
    divCard.classList.add('card', 'border-0');

    const divCardBody = document.createElement('div');
    divCardBody.classList.add('card-body');

    const titleCardBody = document.createElement('h2');
    titleCardBody.classList.add('card-title', 'h-4');
    titleCardBody.textContent = i18n.t('titles.posts');
    divCardBody.appendChild(titleCardBody);

    divCard.appendChild(divCardBody);

    const ulCard = document.createElement('ul');
    ulCard.classList.add('list-group', 'list-group-flush', 'border-0', 'rounded-0');

    value.map(({ id, idFeed, title, description, link }) => {
        const liCard = document.createElement('li');
        liCard.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

        const linkPost = document.createElement('a');
        linkPost.setAttribute('href', link);
        linkPost.dataset.id = id;
        linkPost.setAttribute('target', '_blank');
        linkPost.setAttribute('rel', 'noopener noreferrer');
        linkPost.classList.add('link-offset-2', 'link-offset-3-hover', 'link-underline', 'link-underline-opacity-0', 'link-underline-opacity-75-hover');
        linkPost.classList.add('fw-bold');
        linkPost.textContent = title;
        liCard.appendChild(linkPost);

        // Button trigger modal
        const btnWatch = document.createElement('button');
        btnWatch.setAttribute('type', 'button');
        btnWatch.classList.add('btn', 'btn-outline-primary', 'btn-sm');
        btnWatch.dataset.id = id;
        btnWatch.dataset.bsToggle = "modal";
        btnWatch.dataset.bsTarget = "#modal";
        btnWatch.textContent = i18n.t('buttons.watchPost');

        liCard.appendChild(btnWatch);

        //Modal 
        const divModal = createModalWindow(id, title, description, link, i18n);
        liCard.appendChild(divModal);

        ulCard.appendChild(liCard);

    });

    divCard.appendChild(ulCard);
    listPosts.appendChild(divCard);
};

const render = (state, elements, i18n) => (path, value, prevValue) => {
    switch (path) {
        case 'rssForm.valid':
            renderValidStatusRssForm(elements, value);
            break;

        case 'rssForm.error':
            renderErrorsRssForm(elements, value, i18n);
            break;

        case 'loadedFeeds.feeds':
            renderFeedbackLoadedFeeds(elements, i18n);
            renderListFeeds(elements, value, i18n);
            break;

        case 'loadedPosts.posts':
            renderListPosts(elements, value, i18n);
            break;

        default:
            break;
    }
};

const onChangeState = (state, elements, i18n) => onChange(state, render(state, elements, i18n));

export default onChangeState; 