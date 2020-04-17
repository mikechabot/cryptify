import crypto from 'crypto';
import { program } from 'commander';

import CryptifyCli from '../CryptifyCli';

import logger from '../util/logger';
import packageDotJson from '../../package.json';

import {COMMANDS, options} from '../const';
const {version, help, helpCommand, list, password, cipher, encoding} = options;

/**
 * Print the supported ciphers by Node.js (per OpenSSL)
 */
function listCiphers () {
    const ciphers = crypto.getCiphers();
    logger.blank();
    logger.info(`Listing ${ciphers.length} supported ciphers...`);
    logger.blank();
    ciphers.forEach(cipher => logger.log(cipher));
    logger.blank();
    logger.info('See https://www.openssl.org/docs/man1.1.1/man1/ciphers.html');
}

function printAdditionalHelp() {
    logger.blank();
    logger.log('Examples:');
    logger.log('  $ cryptify encrypt foo.json bar.txt -p \'Secret123!\'');
    logger.log('  $ cryptify encrypt file.txt -p \'Secret123!\' -c aes-256-cbc-hmac-sha1');
    logger.log('  $ cryptify decrypt foo.json bar.txt -p \'Secret123!\'');
    logger.log('  $ cryptify decrypt file.txt -p \'Secret123!\' -c aes-256-cbc-hmac-sha1');
    logger.blank();
    logger.log('Password Requirements:');
    logger.log('  1. Must contain at least 8 characters');
    logger.log('  2. Must contain at least 1 special character');
    logger.log('  3. Must contain at least 1 numeric character');
    logger.log('  4. Must contain a combination of uppercase and lowercase');
    logger.blank();
    logger.log('Required Password Wrapping:');
    logger.log('  Bash                single-quotes');
    logger.log('  Command Prompt      double-quotes');
    logger.log('  PowerShell          single-quotes');
}

program
    .name('cryptify')
    .version(packageDotJson.version, version.label, version.description)
    .helpOption(help.label, help.description)
    .addHelpCommand(helpCommand.label, helpCommand.description);

program
    .option(list.label, list.description)
    .action(({ list }) => list ? listCiphers() : program.help());

COMMANDS.forEach(({mode, description}) => {
    program
        .command(`${mode} <file...>`)
        .description(`${description}`)
        .requiredOption(password.label, password.description)
        .option(cipher.label, cipher.description)
        .option(encoding.label, encoding.description, encoding.defaultValue)
        .action((command, options) => {
            try {
                const cli = new CryptifyCli(mode, options);
                cli.execute().catch(e => logger.error(e));
            } catch (e) {
                logger.error(e);
            }
        })
        .usage('<file>... (-p <password>) [-c <cipher>] [-e <encoding>]');
});

program.on('--help', printAdditionalHelp);

export function run (args) {
    program.parse(args);
}
