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

import Cryptify from './cryptify';
import { printPasswordWarning } from './print';

module.exports = function CryptifyCLI (configArguments) {
    try {
        const instance = Cryptify.__initFromCLI(configArguments);
        if (instance) {
            instance
                .__cryptify()
                .then(() => {
                    printPasswordWarning();
                })
                .catch((error) => {
                    console.error(`   \u2718 ${error.message}`);
                    printPasswordWarning();
                });
        }
    } catch (error) {
        console.error(error);
    }
};
