import i18next from 'i18next';
import * as yup from 'yup';

import resources from '../locales/index.js';

import onChangeState from './View.js';

import validateData from './utils/validateData.js';
import { getLinks } from './utils/utils.js';
import getUrlWithProxy from './utils/getUrlWithProxy.js';
import getAxiosData from './utils/getAxiosData.js';
import parseData from './utils/parseData.js';
import throwErrorResponse from './utils/throwErrors.js';
import createNewFeed from './utils/createNewFeed.js';
import createListPosts from './utils/createListPosts.js';

const app = () => {
  const elements = {
    baseTextUI: {
      header: document.querySelector('#header'),
      leadText: document.querySelector('#leadText'),
      input: document.querySelector('#url-input'),
      labelInput: document.querySelector('#labelInput'),
      btnSubmit: document.querySelector('#btnSubmit'),
      exampleUrl: document.querySelector('#exampleUrl'),
      footerText: document.querySelector('#footerText'),
      footerLink: document.querySelector('#footerLink'),
    },
    form: document.querySelector('.rss-form'),
    fields: {
      input: document.querySelector('#url-input'),
    },
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    modalWindow: {
      modal: document.getElementById('modal'),
    },
  };

  const { form } = elements;
  const { input } = elements.fields;
  const { modal } = elements.modalWindow;

  const STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    FAIL: 'fail',
  };

  const initialState = {
    loadingProcess: {
      loadingBaseUI: STATUS.IDLE,
      loadingData: {
        loadingDataUrl: STATUS.IDLE,
        error: null,
      },
    },
    rssForm: {
      valid: STATUS.IDLE,
      fields: {
        url: null,
      },
      error: null,
    },

    loadedFeeds: {
      feeds: [],
    },
    loadedPosts: {
      posts: [],
    },
    interface: {
      idCurrentWatchedPost: null,
      idWatchedPosts: new Set(),
    },
  };

  yup.setLocale({
    mixed: {
      url: 'url',
      required: 'required',
      notOneOf: 'notOneOf',
      default: 'url',
    },
  });

  const defaultLanguage = 'ru';

  const i18nInstance = i18next.createInstance();

  i18nInstance
    .init({
      lng: defaultLanguage,
      debug: false,
      resources,
    })
    .then(() => {
      const watchedState = onChangeState(initialState, elements, i18nInstance);

      watchedState.loadingProcess.loadingBaseUI = STATUS.SUCCESS;

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        watchedState.rssForm.fields.url = input.value.trim();

        const feedsLinks = getLinks(watchedState.loadedFeeds.feeds);

        const processingUrl = validateData(watchedState.rssForm.fields, feedsLinks, yup);

        processingUrl
          .then((resolvedValue) => {
            watchedState.loadingProcess.loadingData.loadingDataUrl = STATUS.LOADING;
            watchedState.rssForm.error = null;
            watchedState.rssForm.valid = STATUS.LOADING;

            const url = getUrlWithProxy(resolvedValue.url);

            return getAxiosData(url);
          })
          .then((response) => {
            const statusResponse = response.data.status.http_code;

            throwErrorResponse(statusResponse);

            const parsedData = parseData(response.data.contents);

            const newFeed = createNewFeed(parsedData, watchedState.rssForm.fields.url);

            const postsLinks = getLinks(Object.values(watchedState.loadedPosts.posts));

            const listPosts = createListPosts(parsedData, newFeed.id, postsLinks);

            watchedState.loadedFeeds.feeds.unshift(newFeed);

            watchedState.loadedPosts.posts = [...listPosts, ...watchedState.loadedPosts.posts];

            watchedState.loadingProcess.loadingData.error = null;

            watchedState.loadingProcess.loadingData.loadingDataUrl = STATUS.SUCCESS;
          })

          .catch((err) => {
            if (err.name === 'ValidationError') {
              watchedState.rssForm.error = err.inner[0].type;
              watchedState.rssForm.valid = STATUS.FAIL;
            } else {
              watchedState.loadingProcess.loadingData.error = err.message;
              watchedState.loadingProcess.loadingData.loadingDataUrl = STATUS.FAIL;
            }
          });
      });

      modal.addEventListener('show.bs.modal', (e) => {
        // Button that triggered the modal
        const btnWatchPost = e.relatedTarget;

        // Extract info from data-* attributes
        const idBtnWatchPost = btnWatchPost.getAttribute('data-id');

        // Update the modal's content
        watchedState.interface.idCurrentWatchedPost = idBtnWatchPost;

        // Update watched posts
        const { idWatchedPosts } = watchedState.interface;
        idWatchedPosts.add(idBtnWatchPost);
      });

      const updateListPosts = () => {
        const { feeds } = watchedState.loadedFeeds;
        const postsLinks = getLinks(Object.values(watchedState.loadedPosts.posts));

        const promises = feeds.map(({ id, link }) => {
          const url = getUrlWithProxy(link);

          return getAxiosData(url)
            .then((response) => {
              const statusResponse = response.data.status.http_code;

              throwErrorResponse(statusResponse);

              const parsedData = parseData(response.data.contents);

              const listPosts = createListPosts(parsedData, id, postsLinks);

              watchedState.loadedPosts.posts = [...listPosts, ...watchedState.loadedPosts.posts];
            })
            .catch(() => { });
        });

        Promise.all(promises)
          .then(() => setTimeout(updateListPosts, 5000));
      };

      updateListPosts();
    }); // end then i18nInstance
};

export default app;
