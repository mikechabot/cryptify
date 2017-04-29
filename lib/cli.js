'use strict';

var _cryptify = require('./cryptify');

var _cryptify2 = _interopRequireDefault(_cryptify);

var _print = require('./print');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Cryptify
 * @author Mike Chabot
 * @description File-based encryption utility for Node.js
 */

module.exports = function (configArguments) {
    if (configArguments.length === 0) {
        new _cryptify2.default().printHelp();
        process.exit();
    } else {
        return new Promise(function (resolve) {
            new _cryptify2.default(configArguments).cryptify().then(function (results) {
                (0, _print.printPasswordWarning)();
                resolve(results);
            }).catch(function (error) {
                console.error(error);
                process.exit(1);
            });
        });
    }
};