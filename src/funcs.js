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

