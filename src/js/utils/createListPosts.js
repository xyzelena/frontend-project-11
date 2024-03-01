import { getRandomId } from './utils.js';

const findAllPosts = (doc, idFeed) => {
  const items = [...doc.querySelectorAll('item')];

  const posts = items.map((item) => {
    const titlePost = item.querySelector('title').textContent;
    const descriptionPost = item.querySelector('description').textContent;
    const linkPost = item.querySelector('link').textContent;

    const post = {
      id: getRandomId(),
      idFeed,
      title: titlePost,
      description: descriptionPost,
      link: linkPost,
    };

    return post;
  });

  return posts;
};

const createListPosts = (doc, idFeed, postsLinks) => {
  const newPosts = findAllPosts(doc, idFeed);

  if (postsLinks.length === 0) return newPosts;

  const uniqPosts = newPosts.filter(({ link }) => !postsLinks.includes(link));

  return uniqPosts;
};

export default createListPosts;
