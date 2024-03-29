const throwErrorResponse = (statusResponse) => {
  if (statusResponse >= 200 && statusResponse < 300) {
    return true;
  } if (statusResponse >= 400 && statusResponse < 500) {
    throw new Error('noDataContents');
  } else {
    throw new Error('networkError');
  }
};

export default throwErrorResponse;
