import short from 'short-uuid';

export const getLinks = (arr) => arr.map((item) => item.link);

export const getRandomId = () => short.generate();
