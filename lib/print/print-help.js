'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = printHelp;
function printHelp(ctx) {
    ctx.__log('');
    ctx.__log('   Cryptify v' + ctx.getVersion() + ' File-based Encryption Utility');
    ctx.__log('   https://www.npmjs.com/package/cryptify');
    ctx.__log('   Implements Node.js Crypto (https://nodejs.org/api/crypto.html)');
    ctx.__log('');
    ctx.__log('   Usage:');
    ctx.__log('       cryptify (<file>... (-p <password>) (command) [options] | [other])');
    ctx.__log('       cryptify ./configuration.props -p \'mySecretKey\' -e -c aes-256-cbc');
    ctx.__log('       cryptify ./foo.json ./bar.json -p \'mySecretKey\' --decrypt --log');
    ctx.__log('       cryptify --version');
    ctx.__log('');
    ctx.__log('   Required Commands:');
    ctx.__log('       -e --encrypt              Encrypt the file(s)');
    ctx.__log('       -d --decrypt              Decrypt the file(s)');
    ctx.__log('');
    ctx.__log('   Required Arguments:');
    ctx.__log('       -p --password             Cryptographic key');
    ctx.__log('');
    ctx.__log('   Optional Arguments:');
    ctx.__log('       -c --cipher <algorithm>   Cipher algorithm (Default: aes-256-cbc-hmac-sha256)');
    ctx.__log('       -r --return               Return decrypted file(s) in Promise');
    ctx.__log('       -n --encoding <encoding>  Character encoding of returned file(s) (Default: utf8)');
    ctx.__log('       -l --log                  Enable debug log');
    ctx.__log('       -h --help                 Show this menu');
    ctx.__log('       -v --version              Show version');
    ctx.__log('');
    ctx.__log('   Required Password Wrapping:');
    ctx.__log('       Bash                      single-quotes');
    ctx.__log('       Command Prompt            double-quotes');
    ctx.__log('       PowerShell                single-quotes');
    ctx.__log('');
    ctx.__log('   Password Requirements:');
    ctx.__log('       1) Must contain at least 8 characters');
    ctx.__log('       2) Must contain at least 1 special character');
    ctx.__log('       3) Must contain at least 1 numeric character');
    ctx.__log('       4) Must contain a combination of uppercase and lowercase');
}