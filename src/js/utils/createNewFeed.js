import { getRandomId } from './utils.js';

const createNewFeed = (doc, url) => {
  const titleFeed = doc.querySelector('title').textContent;
  const descriptionFeed = doc.querySelector('description').textContent;

  const newFeed = {
    id: getRandomId(),
    title: titleFeed,
    description: descriptionFeed,
    link: url,
  };

  return newFeed;
};

export default createNewFeed;
