'use strict';

const TelegramBot = require('node-telegram-bot-api');
const defs = require('./definitions');
const { session } = defs;
const {
    randomFilm,
    mGetKinopoiskFilms,
    mGetImdbFilms,
    getKinopoiskFilmFromImdb,
    filmInfo,
    getFilmsByKeywords,
    getFilmByTitle,
} = require('./funcs');

const bot = new TelegramBot('5005725004:AAHf6xAd8aZ3w7UO6_pksEA7g1X1e4H4Avc', {
    polling: true
});
bot.status = session.none;

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const buttonInfo = JSON.parse(query.data);
    bot.sendMessage(chatId, 'Ищем подходящий фильм 🎥');
    let film;
    if (buttonInfo.api === 'kinopoisk') {
        film = randomFilm(await mGetKinopoiskFilms(buttonInfo.genre));
    } else {
        const randFilm = randomFilm(await mGetImdbFilms(buttonInfo.genre));
        film = await getKinopoiskFilmFromImdb(randFilm);
    }
    const info = filmInfo(film);
    bot.sendPhoto(chatId, info.poster, { caption: info.caption });
});

bot.on('polling_error', (onerror) => {
    console.log(onerror);
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const oddText = defs.home.concat([['/start']]);
    if (oddText.some((value) => value[0] === msg.text)) return;
    switch (bot.status) {
        case session.none:
            bot.sendMessage(chatId, 'Для работы с ботом выберите функцию👇', {
                reply_markup: {
                    keyboard: defs.home,
                    resize_keyboard: true,
                },
            });
            break;
        case session.filmByTitle:
            const filmInfo = await getFilmByTitle(msg.text);
            bot.sendPhoto(chatId, filmInfo.poster, { caption: filmInfo.caption });
            break;
        case session.filmsByKeywords:
            const films = await getFilmsByKeywords(msg.text);
            let messageText;
            if (films !== '') messageText = films;
            else messageText = 'Ничего не найдено(';
            bot.sendMessage(chatId, messageText);
            break;
    }
    bot.status = session.none;
});