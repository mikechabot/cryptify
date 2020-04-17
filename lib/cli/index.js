"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;

var _crypto = _interopRequireDefault(require("crypto"));

var _commander = require("commander");

var _index = _interopRequireDefault(require("../index"));

var _logger = _interopRequireDefault(require("../util/logger"));

var _package = _interopRequireDefault(require("../../package.json"));

var _const = require("../const");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var {
  version,
  help,
  helpCommand,
  list,
  password,
  cipher,
  encoding
} = _const.options;
/**
 * Print the supported ciphers by Node.js (per OpenSSL)
 */

function listCiphers() {
  var ciphers = _crypto.default.getCiphers();

  _logger.default.blank();

  _logger.default.info("Listing ".concat(ciphers.length, " supported ciphers..."));

  _logger.default.blank();

  ciphers.forEach(cipher => _logger.default.log(cipher));

  _logger.default.blank();

  _logger.default.info('See https://www.openssl.org/docs/man1.1.1/man1/ciphers.html');
}

function printAdditionalHelp() {
  _logger.default.blank();

  _logger.default.log('Examples:');

  _logger.default.log('  $ cryptify encrypt foo.json bar.txt -p \'Secret123!\'');

  _logger.default.log('  $ cryptify encrypt file.txt -p \'Secret123!\' -c aes-256-cbc-hmac-sha1');

  _logger.default.log('  $ cryptify decrypt foo.json bar.txt -p \'Secret123!\'');

  _logger.default.log('  $ cryptify decrypt file.txt -p \'Secret123!\' -c aes-256-cbc-hmac-sha1');

  _logger.default.blank();

  _logger.default.log('Password Requirements:');

  _logger.default.log('  1. Must contain at least 8 characters');

  _logger.default.log('  2. Must contain at least 1 special character');

  _logger.default.log('  3. Must contain at least 1 numeric character');

  _logger.default.log('  4. Must contain a combination of uppercase and lowercase');

  _logger.default.blank();

  _logger.default.log('Required Password Wrapping:');

  _logger.default.log('  Bash                single-quotes');

  _logger.default.log('  Command Prompt      double-quotes');

  _logger.default.log('  PowerShell          single-quotes');
}

_commander.program.name('cryptify').version(_package.default.version, version.label, version.description).helpOption(help.label, help.description).addHelpCommand(helpCommand.label, helpCommand.description);

_commander.program.option(list.label, list.description).action((_ref) => {
  var {
    list
  } = _ref;
  return list ? listCiphers() : _commander.program.help();
});

_const.COMMANDS.forEach((_ref2) => {
  var {
    mode,
    description
  } = _ref2;

  _commander.program.command("".concat(mode, " <file...>")).description("".concat(description)).requiredOption(password.label, password.description).option(cipher.label, cipher.description).option(encoding.label, encoding.description, encoding.defaultValue).action((command, options) => {
    try {
      var cryptify = new _index.default(mode, options.args, options.password, options.cipher, options.encoding, options.obfuscate);
      cryptify.execute().catch(e => _logger.default.error(e));
    } catch (e) {
      _logger.default.error(e);
    }
  }).usage('<file>... (-p <password>) [-c <cipher>] [-e <encoding>]');
});

_commander.program.on('--help', printAdditionalHelp);

function run(args) {
  _commander.program.parse(args);
}