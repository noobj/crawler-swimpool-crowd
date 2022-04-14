const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
const url = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`;

module.exports.connect = async function () {
    await mongoose.connect(url);
};

module.exports.disconnect = async function () {
    await mongoose.connection.close();
};
