import axios from 'axios';

const getAxiosData = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);

export default getAxiosData; 