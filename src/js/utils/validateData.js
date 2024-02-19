const validateData = (url, listLinks, yup) => {
    const schema = yup.object().shape({
        url: yup.string()
            .url('url must be correct')
            .required('url must be required')
            .notOneOf(listLinks, 'url must be uniq'),
    });

    return schema.validate(url, { abortEarly: false });
};

export default validateData; 