export const throwErrorResponse = (statusResponse) => {
    if (statusResponse === 304) {
        throw new Error('networkError');
    }
    else if (statusResponse >= 400 && statusResponse < 500) {
        throw new Error('noDataContents');
    } else if (statusResponse >= 500 && statusResponse < 600) {
        throw new Error('networkError');
    }
    else return;
};