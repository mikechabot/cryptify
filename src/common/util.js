/**
 * Cryptify - A file-based encryption utility for Node.js
 * Copyright (C) 2017 Mike Chabot
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */

import { SPECIAL_CHARACTERS } from './const';

/**
 * Look in an array for an array of values
 * @param lookIn
 * @param lookFor
 * @returns {boolean}
 * @private
 */
export function _contains (lookIn, lookFor) {
    if (!lookIn || !lookFor) return false;
    return lookFor.some(entry => {
        return lookIn.includes(entry);
    });
}

/**
 * Replace a password string with asterisks.
 * Leaves the first and last characters in plain text
 * @param password
 * @returns {string}
 * @private
 */
export function _getSafePassword (password) {
    let safePassword = [];
    const length = password.length;
    for (let i = 0; i < length - 2; i++) {
        safePassword.push('*');
    }
    safePassword.unshift(password[0]);
    safePassword.push(password[length - 1]);
    return safePassword.join('');
}

export function _isValidPassword (password) {
    function _hasUpperCase (str) {
        if (!str) return false;
        return str.trim().toLowerCase() !== str;
    }
    function _hasLowerCase (str) {
        if (!str) return false;
        return str.trim().toUpperCase() !== str;
    }
    function _hasNumber (str) {
        if (!str) return false;
        return /\d/.test(str);
    }
    return password !== null &&
        password !== undefined &&
        typeof password === 'string' &&
        password.trim().length >= 8 &&
        _contains(password.trim().split(''), SPECIAL_CHARACTERS) &&
        _hasNumber(password) &&
        _hasUpperCase(password) &&
        _hasLowerCase(password);
}
