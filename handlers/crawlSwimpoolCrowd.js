const Crawler = require('crawler');
const moment = require('moment-timezone');
const mongoose = require('../db/mongoose-connect');
const Entry = require('../db/models/entry.model');

exports.handler = function () {
    const c = new Crawler({
        callback: async (error, res, done) => {
            console.log('start');
            if (error) {
                console.log(error);
                return;
            }

            const $ = res.$;
            const amount = $('p font', '.w3_agile_logo').first().text();
            await mongoose.connect();
            const newEntry = new Entry({
                amount,
                time: moment().tz('Asia/Taipei').format('yyyy-MM-DD HH:mm')
            });
            await newEntry.save().catch((err) => console.err(err));

            console.log('done');
            await mongoose.disconnect();
            done();
        }
    });
    try {
        c.queue('http://tndcsc.com.tw/index.aspx');
    } catch (err) {
        console.err(err);
    }
};
