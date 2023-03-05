const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');
const { getDateStr, formatDate } = require('./helpers')

db.run("CREATE TABLE IF NOT EXISTS work_time (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT UNIQUE, chat_id INTEGER, user_id INTEGER MOT NULL, start INTEGER, finish INEGER, holiday INTEGER DEFAULT 0, eat INEGER DEFAULT 1)")

exports.saveHoliday = (chatId, callback) => {
    date = new Date()
    const query = db.prepare("UPDATE work_time SET holiday=? WHERE chat_id=? AND date=?")
    query.run(1, chatId, getDateStr(date), (err) => {
        callback()
    })
    query.finalize()
}

exports.saveEat = (chatId, callback) => {
    date = new Date()
    const query = db.prepare("UPDATE work_time SET eat=? WHERE chat_id=? AND date=?")
    query.run(0, chatId, getDateStr(date), (err) => {
        callback()
    })
    query.finalize()
}

exports.saveTime = (chatId, userId, timestamp, callback, isFinish = false) => {
    if (isFinish) {
        date = new Date()
        dateStr = getDateStr(date)
        sql = "UPDATE work_time SET finish=?"
        if (date.getHours() < 15) {
            sql += ", eat=0"
        }
        sql += 'WHERE chat_id=? AND date=?'
        const query = db.prepare(sql)
        query.run(timestamp, chatId, dateStr, (err) => {
            if (err) {
                callback('error')
            } else {
                callback('confirm')
            }
        })
        query.finalize()
    } else {
        const query = db.prepare("INSERT INTO work_time (date, chat_id, user_id, start) VALUES (?, ?, ?, ?)")
        date = new Date()
        query.run(`${date.getFullYear()}-${formatDate(date.getMonth(), true)}-${formatDate(date.getDate())}`, chatId, userId, timestamp, (err) => {
            if (err) {
                callback('error')
            } else {
                callback('confirm')
            }
        })
        query.finalize()
    }
}