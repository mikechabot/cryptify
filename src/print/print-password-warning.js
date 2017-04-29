/**
 * Print warning notifying user to clear shell history
 */
export default function printPasswordWarning () {
    console.log('');
    console.log('  +----------------------------------------------------------------------+');
    console.log('  |   ** NOTE: You just entered a password key into a shell session **   |');
    console.log('  |           Strongly consider clearing your session history            |');
    console.log('  |        https://www.npmjs.com/package/cryptify#recommendations        |');
    console.log('  +----------------------------------------------------------------------+');
    console.log('');
}
