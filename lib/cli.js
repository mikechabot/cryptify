'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _cryptify = require('./cryptify');

var _cryptify2 = _interopRequireDefault(_cryptify);

var _print = require('./print');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var cli = function cli(args) {
    try {
        var instance = _cryptify2.default.__initFromCLI(args);
        if (instance) {
            instance.__cryptify().catch(function (error) {
                console.error('   \u2718 ' + (error && error.message || 'An error has occurred'));
            }).finally(_print.printPasswordWarning);
        }
    } catch (error) {
        console.error(error);
    }
};

exports.default = cli;