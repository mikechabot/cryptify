'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = printPasswordWarning;
/**
 * Print warning notifying user to clear shell history
 */
function printPasswordWarning() {
    console.log('');
    console.log('  +----------------------------------------------------------------------+');
    console.log('  |   ** NOTE: You just entered a password key into a shell session **   |');
    console.log('  |           Strongly consider clearing your session history            |');
    console.log('  |        https://www.npmjs.com/package/cryptify#recommendations        |');
    console.log('  +----------------------------------------------------------------------+');
    console.log('');
}