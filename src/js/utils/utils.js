import short from 'short-uuid';

export const getLinks = (arr) => arr.map((arr) => arr.link);

export const getRandomId = () => short.generate();
