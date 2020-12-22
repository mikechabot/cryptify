import logger from './index';

import { CommandMode } from '../../const/types';
import { SupportedCiphers } from '../../const';

/**
 * Print password requirements
 */
export function printPasswordRequirements() {
  logger.log('Password Requirements:');
  logger.log('  1. Must contain at least 8 characters');
  logger.log('  2. Must contain at least 1 special character');
  logger.log('  3. Must contain at least 1 numeric character');
  logger.log('  4. Must contain a combination of uppercase and lowercase');
  logger.log('');
  logger.log('Pass "--loose" (or "-o") to bypass password requirements.');
}

/**
 * Print additional usage help
 */
export function printAdditionalHelp() {
  logger.blank();
  logger.log('Example:');
  logger.log("  $ cryptify encrypt file.txt -p 'Secret123!'");
  logger.log("  $ cryptify decrypt file.txt -p 'Secret123!'");
  logger.blank();
  printPasswordRequirements();
}

/**
 * Print plaintext password warning
 */
export function printPasswordWarning() {
  logger.blank();
  logger.log(' \u00BB You may have entered a plaintext password into a shell session');
  logger.log(' \u00BB Strongly consider clearing your session history');
  logger.log(' \u00BB See https://www.npmjs.com/package/cryptify#recommendations');
}

/**
 * Print the supported ciphers by Node.js (per OpenSSL)
 */
export function printCiphers() {
  logger.blank();
  logger.info(`Listing ${SupportedCiphers.length} supported ciphers...`);
  logger.blank();
  SupportedCiphers.forEach((cipher) => logger.log(cipher));
  logger.blank();
  logger.info('https://github.com/mikechabot/cryptify#supported-ciphers');
}

export function printRunHelp(isModule: boolean, mode: CommandMode | undefined) {
  return !isModule ? `Run cryptify help ${mode}.` : '';
}
