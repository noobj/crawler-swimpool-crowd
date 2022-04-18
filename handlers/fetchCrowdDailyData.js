const moment = require('moment-timezone');
const mongoose = require('../db/mongoose-connect');
const Entry = require('../db/models/entry.model');
const { checkValidDateTimeFormat } = require('./helper');

moment.tz.setDefault('Asia/Taipei');

exports.handler = async function (event, context, callback) {
    await mongoose.connect();
    let start = moment().startOf('day').format('YYYY-MM-DD HH:mm');
    let end = moment().add(0, 'day').format('YYYY-MM-DD HH:mm');
    if (event.queryStringParameters) {
        start = event.queryStringParameters.start
            ? moment(event.queryStringParameters.start)
                  .startOf('day')
                  .format('YYYY-MM-DD HH:mm')
            : start;
        end = event.queryStringParameters.end
            ? moment(event.queryStringParameters.end)
                  .endOf('day')
                  .format('YYYY-MM-DD HH:mm')
            : end;
    }
    if (!checkValidDateTimeFormat([start, end])) {
        callback(null, {
            statusCode: 400,
            body: JSON.stringify('Wrong parameter format.')
        });
    }

    const entries = await Entry.aggregate([
        {
            $match: {
                $and: [
                    {
                        time: {
                            $gte: start
                        }
                    },
                    {
                        time: {
                            $lte: end
                        }
                    }
                ]
            }
        },
        {
            $group: {
                _id: {
                    $substr: ['$time', 0, 10]
                },
                entries: {
                    $push: {
                        amount: '$amount',
                        time: '$time'
                    }
                }
            }
        }
    ]);

    const res = entries.map((entry) => {
        return {
            date: moment(entry._id).format('yyyy-MM-DD (ddd)'),
            entries: entry.entries
        };
    });
    await mongoose.disconnect();
    callback(null, {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(res)
    });
};
