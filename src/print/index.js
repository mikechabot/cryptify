
import crypto from 'crypto';
import CryptifyException from '../common/exception';
import { CRYPTIFY_VERSION } from '../common/const';

export function printCiphers () {
    if (!crypto) throw new CryptifyException('crypto not found');
    console.log(crypto.getCiphers());
}

export function printVersion () {
    console.log(CRYPTIFY_VERSION);
}

export function printPasswordWarning () {
    console.log('');
    console.log('  +----------------------------------------------------------------------+');
    console.log('  |   ** NOTE: You just entered a password key into a shell session **   |');
    console.log('  |           Strongly consider clearing your session history            |');
    console.log('  |        https://www.npmjs.com/package/cryptify#recommendations        |');
    console.log('  +----------------------------------------------------------------------+');
    console.log('');
}

export function printHelp () {
    console.log('');
    console.log(`   Cryptify v${CRYPTIFY_VERSION} File-based Encryption Utility`);
    console.log('   https://www.npmjs.com/package/cryptify');
    console.log('   Implements Node.js Crypto (https://nodejs.org/api/crypto.html)');
    console.log('');
    console.log('   Usage:');
    console.log('       cryptify (<file>... (-p <password>) (command) [options] | [other])');
    console.log('       cryptify ./configuration.props -p \'mySecretKey\' -e -c aes-256-cbc');
    console.log('       cryptify ./foo.json ./bar.json -p \'mySecretKey\' --decrypt --log');
    console.log('       cryptify --version');
    console.log('');
    console.log('   Required Commands:');
    console.log('       -e --encrypt              Encrypt the file(s)');
    console.log('       -d --decrypt              Decrypt the file(s)');
    console.log('');
    console.log('   Required Arguments:');
    console.log('       -p --password             Cryptographic key');
    console.log('');
    console.log('   Optional Arguments:');
    console.log('       -c --cipher <algorithm>   Cipher algorithm (Default: aes-256-cbc-hmac-sha256)');
    console.log('       -r --return               Return decrypted file(s) in Promise');
    console.log('       -n --encoding <encoding>  Character encoding of returned file(s) (Default: utf8)');
    console.log('       -l --list                 List available ciphers');
    console.log('       -h --help                 Show this menu');
    console.log('       -v --version              Show version');
    console.log('');
    console.log('   Required Password Wrapping:');
    console.log('       Bash                      single-quotes');
    console.log('       Command Prompt            double-quotes');
    console.log('       PowerShell                single-quotes');
    console.log('');
    console.log('   Password Requirements:');
    console.log('       1) Must contain at least 8 characters');
    console.log('       2) Must contain at least 1 special character');
    console.log('       3) Must contain at least 1 numeric character');
    console.log('       4) Must contain a combination of uppercase and lowercase');
}
