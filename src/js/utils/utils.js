import short from 'short-uuid';

export const getLinks = (arr) => arr.map(arr => arr.link);

export const getIds = (arr) => arr.map(arr => arr.id);

export const getRandomId = () => short.generate(); 