"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;

var _commander = require("commander");

var _CryptifyCli = _interopRequireDefault(require("../CryptifyCli"));

var _package = _interopRequireDefault(require("../../package.json"));

var _const = require("../const");

var _information = require("../util/logger/information");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var {
  version,
  help,
  helpCommand,
  list,
  password,
  cipher,
  encoding,
  silent
} = _const.options;

_commander.program.name('cryptify').version(_package.default.version, version.label, version.description).helpOption(help.label, help.description).addHelpCommand(helpCommand.label, helpCommand.description);

_commander.program.option(list.label, list.description).action((_ref) => {
  var {
    list
  } = _ref;
  return list ? (0, _information.printCiphers)() : _commander.program.help();
});

_const.COMMANDS.forEach((_ref2) => {
  var {
    mode,
    description
  } = _ref2;

  _commander.program.command("".concat(mode, " <file...>")).description("".concat(description)).requiredOption(password.label, password.description).option(cipher.label, cipher.description).option(encoding.label, encoding.description, encoding.defaultValue).option(silent.label, silent.description, silent.defaultValue).action((command, options) => {
    try {
      var instance = new _CryptifyCli.default(mode, options);
      instance.execute().catch(e => console.error(e)).finally(_information.printPasswordWarning);
    } catch (e) {
      console.error(e);
    }
  }).usage('<file>... (-p <password>) [-c <cipher>] [-e <encoding>] [-s]');
});

_commander.program.on('--help', _information.printAdditionalHelp);

function run(args) {
  _commander.program.parse(args);
}