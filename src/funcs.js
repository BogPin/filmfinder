const request = require('request');
const defs = require('./definitions');

const loger = (err) => console.log(err);

const memoize = (fn) => {
    const cache = Object.create(null);
    return async (...args) => {
        const key = args[0];
        const val = cache[key];
        if (val) return val;
        const res = await fn(...args);
        cache[key] = res;
        return res;
    };
};

const makeRequest = (options) =>
    new Promise((resolve, reject) => {
        request(null, options, (error, response) => {
            if (error) reject(error);
            else resolve(JSON.parse(response.body));
        });
    });

const imdbLinkGenerator = (genre) => {
    const preLink = defs.imdbPrelink;
    const postLink = defs.imdbPostlink;
    return preLink + genre + postLink;
};

const kinopoiskLinkGenerator = (genre, page) => {
    const preLink = defs.kinopoiskPrelink;
    const postLink = defs.kinopoiskPostlink;
    return preLink + genre + postLink + page;
};

const kinopoiskFromImdbLinkGenerator = (id) => {
    const preLink = defs.imdbToKinopoiskPrelink;
    const postLink = defs.imdbToKinopoiskPostlink;
    return preLink + id + postLink;
};

const kinopoiskKeyWordLinkGenerator = (keyWords) => {
    const preLink = defs.kinopoiskKeyWordPrelink;
    const postLink = defs.kinopoiskKeyWordPostlink;
    return preLink + encodeURI(keyWords) + postLink;
};

