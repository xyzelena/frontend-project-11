export const throwErrorResponse = (statusResponse) => {
    if (statusResponse >= 300 && statusResponse < 400) {
        throw new Error('networkError');
    }
    else if (statusResponse >= 400 && statusResponse < 500) {
        throw new Error('noDataContents');
    } else if (statusResponse >= 500 && statusResponse < 600) {
        throw new Error('networkError');
    }
    else return;
};