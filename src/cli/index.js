import { program } from 'commander';

import CryptifyCli from '../CryptifyCli';

import packageDotJson from '../../package.json';

import {COMMANDS, options} from '../const';
import {printAdditionalHelp, printCiphers, printPasswordWarning} from '../util/logger/information';

const {version, help, helpCommand, list, password, cipher, encoding, silent} = options;


program
    .name('cryptify')
    .version(packageDotJson.version, version.label, version.description)
    .helpOption(help.label, help.description)
    .addHelpCommand(helpCommand.label, helpCommand.description);

program
    .option(list.label, list.description)
    .action(({ list }) => list ? printCiphers() : program.help());

COMMANDS.forEach(({mode, description}) => {
    program
        .command(`${mode} <file...>`)
        .description(`${description}`)
        .requiredOption(password.label, password.description)
        .option(cipher.label, cipher.description)
        .option(encoding.label, encoding.description, encoding.defaultValue)
        .option(silent.label, silent.description, silent.defaultValue)
        .action((command, options) => {
            try {
                const instance = new CryptifyCli(mode, options);
                instance
                    .execute()
                    .catch(e => console.error(e))
                    .finally(printPasswordWarning);
            } catch (e) {
                console.error(e);
            }
        })
        .usage('<file>... (-p <password>) [-c <cipher>] [-e <encoding>] [-s]');
});

program.on('--help', printAdditionalHelp);

export function run (args) {
    program.parse(args);
}
