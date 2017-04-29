/**
 * Cryptify
 * @author Mike Chabot
 * @description File-based encryption utility for Node.js
 */

import Cryptify from './cryptify';
import { printPasswordWarning } from './print';

module.exports = function (configArguments) {
    if (configArguments.length === 0) {
        new Cryptify().printHelp();
        process.exit();
    } else {
        return new Promise(resolve => {
            new Cryptify(configArguments)
                .cryptify()
                .then(results => {
                    printPasswordWarning();
                    resolve(results);
                })
                .catch(error => {
                    console.error(error);
                    process.exit(1);
                });
        });
    }
};
