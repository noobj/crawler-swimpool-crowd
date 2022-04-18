const moment = require('moment-timezone');

exports.checkValidDateTimeFormat = function (values) {
    if (!(values instanceof Array)) values = [values];
    for (const value of values)
        if (!moment(value, 'YYYY-MM-DD HH:mm', true).isValid()) return false;

    return true;
};
