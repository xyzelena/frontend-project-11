const parseData = (rawContents) => {
    const parser = new DOMParser();

    const parsedData = parser.parseFromString(rawContents, "text/xml");

    return parsedData; 
};

export { parseData }; 