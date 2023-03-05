const TelegramBot = require('node-telegram-bot-api');
const { saveEat, saveHoliday, saveTime } = require('./handlers/db');
require('dotenv').config()


const token = process.env.TOKEN_TG;
const bot = new TelegramBot(token, { polling: true });

const convertTime = (date) => {
    date = new Date(date * 1000);
    return date.getTime();
}

const sendMsg = (chatId, text) => {
    bot.sendMessage(chatId, text)
}

const sendConfirmation = async (chatId) => {
    reply_markup = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Festivo", callback_data: "holiday" },
                { text: "Sin comer", callback_data: "no-eat" }]
            ]
        }
    }
    bot.sendMessage(chatId, 'He apuntado', reply_markup)
}

const sendError = (chatId) => {
    bot.sendMessage(chatId, 'No puedo apuntar, ya tengo apundado este día')
}

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    switch (msg.text) {
        case '/start':
            bot.sendMessage(chatId, 'Hola, buenas! Soy un bot y te ayudo contar tus horas de trabajo', {
                reply_markup: {
                    keyboard: [
                        [{ text: "Empiezo trabajo", callback_data: "start" },
                        { text: "Termino trabajo", callback_data: "finish" }],
                        [{ text: "Estadísticas", callback_data: "stats" }]
                    ]
                }
            })
            break;
        case 'Empiezo trabajo':
            let timeStart = convertTime(msg.date)
            saveTime(chatId, msg.from.id, timeStart, (msg) => {
                switch (msg) {
                    case 'error':
                        sendError(chatId)
                        break;

                    case 'confirm':
                        sendConfirmation(chatId)
                        break;
                }
            })
            break
        case 'Termino trabajo':
            let timeFinish = convertTime(msg.date)
            saveTime(chatId, msg.from.id, timeFinish, (msg) => {
                switch (msg) {
                    case 'error':
                        sendError(chatId)
                        break;

                    case 'confirm':
                        sendConfirmation(chatId)
                        break;
                }
            }, true)
            break
        default:
            bot.sendMessage(chatId, "Perdoname, no te entiendo!")
            break;
    }
});


bot.on('callback_query', (callback_query) => {
    const chatId = callback_query.message.chat.id
    switch (callback_query.data) {
        case 'holiday':
            saveHoliday(callback_query.message.chat.id, () => sendMsg(chatId, 'Apuntado que es un festivo!'))
            break;
        case 'no-eat':
            saveEat(callback_query.message.chat.id, () => sendMsg(chatId, 'Apuntado sin comer!'))
            break;
    }
})
