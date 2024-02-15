import * as yup from 'yup';

yup.setLocale({
    mixed: {
        url: 'url',
        required: 'required',
        notOneOf: 'notOneOf',
        default: 'url',
    },
});

const validateData = (url, listLinks) => {
    const schema = yup.object().shape({
        url: yup.string()
            .url('url must be correct')
            .required('url must be required')
            .notOneOf(listLinks, 'url must be uniq'),
    });

    return schema.validate(url, { abortEarly: false });
};

export default validateData; 