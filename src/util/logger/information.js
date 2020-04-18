import crypto from 'crypto';

import logger from './index';

/**
 * Print password requirements
 */
export function printPasswordRequirements() {
    logger.log('Password Requirements:');
    logger.log('  1. Must contain at least 8 characters');
    logger.log('  2. Must contain at least 1 special character');
    logger.log('  3. Must contain at least 1 numeric character');
    logger.log('  4. Must contain a combination of uppercase and lowercase');
}

/**
 * Print additional usage help
 */
export function printAdditionalHelp() {
    logger.blank();
    logger.log('Example:');
    logger.log('  $ cryptify encrypt file.txt -p \'Secret123!\'');
    logger.log('  $ cryptify decrypt file.txt -p \'Secret123!\'');
    logger.blank();
    printPasswordRequirements();
}

/**
 * Print plaintext password warning
 */
export function printPasswordWarning () {
    logger.blank();
    logger.log(' \u00BB You may have entered a plaintext password into a shell session');
    logger.log(' \u00BB Strongly consider clearing your session history');
    logger.log(' \u00BB See https://www.npmjs.com/package/cryptify#recommendations');
}

/**
 * Print the supported ciphers by Node.js (per OpenSSL)
 */
export function printCiphers () {
    const ciphers = crypto.getCiphers();
    logger.blank();
    logger.info(`Listing ${ciphers.length} supported ciphers...`);
    logger.blank();
    ciphers.forEach(cipher => logger.log(cipher));
    logger.blank();
    logger.info('See https://www.openssl.org/docs/man1.1.1/man1/ciphers.html');
}

export function printRunHelp(isModule, mode) {
    return !isModule
        ? `Run cryptify help ${mode}.`
        : '';
}
