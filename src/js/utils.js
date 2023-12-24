const parseData = (rawContents) => {
    const parser = new DOMParser();

    const parsedData = parser.parseFromString(rawContents, "text/xml");

    return parsedData; 
};

const throwErrorResponse = (statusResponse) => {
    if(statusResponse >= 400 &&  statusResponse < 500){
        throw new Error('noDataContents'); 
    }else if(statusResponse >= 500 &&  statusResponse < 600){
        throw new Error('networkError');
    }
    else return;
}; 

export { parseData, throwErrorResponse }; 