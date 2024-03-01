import axios from 'axios';

const getAxiosData = (url) => axios.get(url)
  .catch((error) => {
    throw new Error('networkError');
  });

export default getAxiosData;
