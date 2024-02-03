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
    divCardBody.append(titleCardBody);

    divCard.append(divCardBody);

    const ulCard = document.createElement('ul');
    ulCard.classList.add('list-group', 'list-group-flush', 'border-0', 'rounded-0');

    value.map(({ title, description }) => {
        const liCard = document.createElement('li');
        liCard.classList.add('list-group-item', 'border-0', 'border-end-0');

        const titleFeed = document.createElement('h3');
        titleFeed.classList.add('h6', 'm-0');
        titleFeed.textContent = title;
        liCard.append(titleFeed);

        const descriptionFeed = document.createElement('p');
        descriptionFeed.classList.add('small', 'm-0', 'text-black-50');
        descriptionFeed.textContent = description;
        liCard.append(descriptionFeed);

        ulCard.append(liCard);
    });

    divCard.append(ulCard);
    listFeeds.append(divCard);
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
    divCardBody.append(titleCardBody);

    divCard.append(divCardBody);

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
        liCard.append(linkPost);

        // Button trigger modal
        const btnWatch = document.createElement('button');
        btnWatch.setAttribute('type', 'button');
        btnWatch.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'btnWatch');
        btnWatch.dataset.id = id;
        btnWatch.dataset.bsToggle = "modal";
        btnWatch.dataset.bsTarget = "#modal";
        btnWatch.textContent = i18n.t('buttons.watchPost');

        liCard.append(btnWatch);

        ulCard.append(liCard);

    });

    divCard.append(ulCard);

    listPosts.append(divCard);
};

const renderModal = (state, elements, value, i18n) => {
    const currentPost = Object.values(state.loadedPosts.posts)
        .find((post) => post.id === value);

    const modal = elements.modalWindow.modal;

    const modalTitle = modal.querySelector('.modal-title');
    modalTitle.textContent = currentPost.title;

    const modalBody = modal.querySelector('.modal-body');

    const descr = document.createElement('p');
    descr.textContent = currentPost.description;
    modalBody.append(descr);

    const btnLink = modal.querySelector('a.btn-primary.full-article');
    btnLink.setAttribute('href', currentPost.link);
    btnLink.textContent = i18n.t('modal.readPost');

    const btnClose = modal.querySelector('button.btn-secondary');
    btnClose.textContent = i18n.t('modal.closeModal');
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

        case 'interface.idCurrentWatchedPost':
            renderModal(state, elements, value, i18n);
            break;

        default:
            break;
    }
};

const onChangeState = (state, elements, i18n) => onChange(state, render(state, elements, i18n));

export default onChangeState; 