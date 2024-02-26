const parseData = (rawContents) => {
    const parser = new DOMParser();

    const parsedData = parser.parseFromString(rawContents, "text/xml");

    const errorNode = parsedData.querySelector('parsererror');

    if (errorNode) {
        throw new Error('noDataContents');
    }

    return parsedData;
};

export default parseData; 