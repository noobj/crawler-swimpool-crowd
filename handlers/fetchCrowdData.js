const moment = require('moment-timezone');
const mongoose = require('../db/mongoose-connect');
const Entry = require('../db/models/entry.model');
const { checkValidDateTimeFormat } = require('./helper');

moment.tz.setDefault('Asia/Taipei');

exports.handler = async function (event, context, callback) {
    await mongoose.connect();
    let start = moment().startOf('day').format('YYYY-MM-DD HH:mm');
    let end = moment().add(1, 'day').format('YYYY-MM-DD HH:mm');
    if (event.queryStringParameters) {
        start = event.queryStringParameters.start
            ? event.queryStringParameters.start
            : start;
        end = event.queryStringParameters.end ? event.queryStringParameters.end : end;
    }
    if (!checkValidDateTimeFormat([start, end])) {
        callback(null, {
            statusCode: 400,
            body: JSON.stringify('Wrong parameter format.')
        });
    }

    const entries = await Entry.find({
        $and: [{ time: { $gte: start } }, { time: { $lte: end } }]
    });

    const res = entries.map((entry) => ({
        amount: entry.amount,
        time: entry.time
    }));

    await mongoose.disconnect();
    callback(null, {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(res)
    });
};
