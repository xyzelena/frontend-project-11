import onChange from 'on-change';

const renderBaseUI = (elements, value, i18n) => {
    if (value === 'success') {
        const {
            header,
            leadText,
            placeholderInput,
            labelInput,
            btnSubmit,
            exampleUrl,
            footerText,
            footerLink,
        } = elements;

        header.textContent = i18n.t('baseTextUI.header');
        leadText.textContent = i18n.t('baseTextUI.leadText');
        placeholderInput.setAttribute('placeholder', i18n.t('baseTextUI.placeholderInput'));
        labelInput.textContent = i18n.t('baseTextUI.labelInput');
        btnSubmit.textContent = i18n.t('baseTextUI.btnSubmit');
        exampleUrl.textContent = i18n.t('baseTextUI.exampleUrl');
        footerText.textContent = i18n.t('baseTextUI.footerText');
        footerLink.textContent = i18n.t('baseTextUI.footerLink');
    }
};

const renderValidStatusRssForm = (elements, value) => {
    const input = elements.input;
    const feedback = elements.feedback;

    if (value === 'success') {
        input.classList.remove('is-invalid');
        feedback.classList.remove('invalid-feedback');

        input.classList.add('is-valid');
        feedback.classList.add('valid-feedback');

        input.value = '';
        input.focus();
    } else if (value === 'fail') {
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

const renderErrorsRssForm = (feedback, value, i18n) => {
    if (value !== null) {
        const error = i18n.t(`mistakes.${value}`);
        feedback.textContent = error;
    }
};

const renderFeedbackLoadedFeeds = (feedback, i18n) => {
    feedback.textContent = i18n.t('confirmation.loaded');
};

const renderListFeeds = (listFeeds, value, i18n) => {
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

const renderListPosts = (idWatchedPosts, listPosts, value, i18n) => {
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

        linkPost.addEventListener('click', (e) => {
            const idCurrentPost = e.target.dataset.id;

            //Update watched posts
            if (idWatchedPosts.indexOf(idCurrentPost) === -1) idWatchedPosts.push(idCurrentPost);
        });

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

const renderModal = (stateLoadedPosts, modal, value, i18n) => {
    const currentPost = Object.values(stateLoadedPosts)
        .find((post) => post.id === value);

    const modalTitle = modal.querySelector('.modal-title');
    modalTitle.textContent = currentPost.title;

    const modalBody = modal.querySelector('.modal-body');

    const descr = modal.querySelector('.descr');
    descr.textContent = currentPost.description;

    const btnLink = modal.querySelector('a.btn-primary.full-article');
    btnLink.setAttribute('href', currentPost.link);
    btnLink.textContent = i18n.t('modal.readPost');

    const btnClose = modal.querySelector('button.btn-secondary');
    btnClose.textContent = i18n.t('modal.closeModal');
};

const renderWatchedListPosts = (listPosts, value) => {
    const idWatchedPosts = value;

    idWatchedPosts.forEach((idPost) => {
        const linkPost = listPosts.querySelector(`a[data-id='${idPost}']`);
        linkPost.classList.remove('fw-bold');
        linkPost.classList.add('fw-normal');
    });

};

const render = (state, elements, i18n) => (path, value, prevValue) => {
    switch (path) {
        case 'loadingProcess.loadingBaseUI':
            renderBaseUI(elements.baseTextUI, value, i18n);
            break;

        case 'rssForm.valid':
            const input = elements.fields.input;
            const feedback = elements.feedback;

            renderValidStatusRssForm({ input, feedback }, value);
            break;

        case 'rssForm.error':
            renderErrorsRssForm(elements.feedback, value, i18n);
            break;

        case 'loadedFeeds.feeds':
            renderFeedbackLoadedFeeds(elements.feedback, i18n);
            renderListFeeds(elements.feeds, value, i18n);
            break;

        case 'loadedPosts.posts':
            renderListPosts(state.interface.idWatchedPosts, elements.posts, value, i18n);
            renderWatchedListPosts(elements.posts, state.interface.idWatchedPosts);
            break;

        case 'interface.idCurrentWatchedPost':
            renderModal(state.loadedPosts.posts, elements.modalWindow.modal, value, i18n);
            break;

        case 'interface.idWatchedPosts':
            renderWatchedListPosts(elements.posts, value);
            break;

        default:
            break;
    }
};

const onChangeState = (state, elements, i18n) => onChange(state, render(state, elements, i18n));

export default onChangeState; 