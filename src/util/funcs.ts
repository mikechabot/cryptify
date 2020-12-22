import { SPECIAL_CHARACTERS, SupportedCiphers } from '../const';
import { hasLowerCase, hasNumber, hasUpperCase, someInclude } from './helpers';

/**
 * Ensure the password meets complexity requirements
 * @param password
 * @returns {boolean|boolean}
 */
export function isValidPassword(password: string) {
  return (
    password !== null &&
    password !== undefined &&
    typeof password === 'string' &&
    password.trim().length >= 8 &&
    someInclude(password.trim().split(''), SPECIAL_CHARACTERS) &&
    hasNumber(password) &&
    hasUpperCase(password) &&
    hasLowerCase(password)
  );
}

/**
 * Ensure the cipher is supported by OpenSSL
 * @param cipher
 * @returns {boolean}
 */
export function isValidCipherAlgorithm(cipher: string) {
  if (cipher === null || cipher === undefined || typeof cipher !== 'string') {
    return false;
  }
  return SupportedCiphers.includes(cipher);
}

/**
 * Replace a password string with asterisks.
 * Leaves the first and last characters in plain text
 * @param password
 * @returns {string|null}
 */
export function getSafePassword(password: string) {
  if (password === null || password === undefined || typeof password !== 'string' || password.trim().length < 3) {
    return null;
  }

  let safePassword = [];
  const length = password.length;
  for (let i = 0; i < length - 2; i++) {
    safePassword.push('*');
  }

  safePassword.unshift(password[0]);
  safePassword.push(password[length - 1]);

  return safePassword.join('');
}

export function getBufferLength(keySize: number) {
  if (keySize === 128 || keySize === 192) {
    return keySize / 8;
  }
  return 32;
}
