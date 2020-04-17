"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printPasswordRequirements = printPasswordRequirements;
exports.printAdditionalHelp = printAdditionalHelp;
exports.printPasswordWarning = printPasswordWarning;
exports.printCiphers = printCiphers;
exports.printRunHelp = printRunHelp;

var _crypto = _interopRequireDefault(require("crypto"));

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Print password requirements
 */
function printPasswordRequirements() {
  _index.default.log('Password Requirements:');

  _index.default.log('  1. Must contain at least 8 characters');

  _index.default.log('  2. Must contain at least 1 special character');

  _index.default.log('  3. Must contain at least 1 numeric character');

  _index.default.log('  4. Must contain a combination of uppercase and lowercase');
}
/**
 * Print additional usage help
 */


function printAdditionalHelp() {
  _index.default.blank();

  _index.default.log('Example:');

  _index.default.log('  $ cryptify encrypt file.txt -p \'Secret123!\' -c aes-256-cbc-hmac-sha1');

  _index.default.log('  $ cryptify decrypt file.txt -p \'Secret123!\' -c aes-256-cbc-hmac-sha1');

  _index.default.blank();

  printPasswordRequirements();
}
/**
 * Print plaintext password warning
 */


function printPasswordWarning() {
  _index.default.blank();

  _index.default.log(' \u00BB You may have entered a plaintext password into a shell session');

  _index.default.log(' \u00BB Strongly consider clearing your session history');

  _index.default.log(' \u00BB See https://www.npmjs.com/package/cryptify#recommendations');
}
/**
 * Print the supported ciphers by Node.js (per OpenSSL)
 */


function printCiphers() {
  var ciphers = _crypto.default.getCiphers();

  _index.default.blank();

  _index.default.info("Listing ".concat(ciphers.length, " supported ciphers..."));

  _index.default.blank();

  ciphers.forEach(cipher => _index.default.log(cipher));

  _index.default.blank();

  _index.default.info('See https://www.openssl.org/docs/man1.1.1/man1/ciphers.html');
}

function printRunHelp(isModule, mode) {
  return !isModule ? "Run cryptify help ".concat(mode, ".") : '';
}