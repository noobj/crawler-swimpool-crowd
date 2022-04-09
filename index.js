const Crawler = require('crawler');
const mongoClient = require('mongodb').MongoClient;
const moment = require('moment');
const url = 'mongodb+srv://jjj:dLUHfblSS53ngtBT@ahorro.o2jmk.mongodb.net/';

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
            const client = await mongoClient.connect(url);
            const dbo = await client.db('swimCrowdDB').collection('entry');
            const newObj = {
                amount,
                date: moment().format('yyyy-MM-DD'),
                time: moment().format('HH:mm')
            };
            await dbo.insertOne(newObj).catch((err) => console.log(err));

            await client.close();
            console.log('done');
            done();
        }
    });
    try {
        c.queue('http://tndcsc.com.tw/index.aspx');
    } catch (err) {
        console.err(err);
    }
};
