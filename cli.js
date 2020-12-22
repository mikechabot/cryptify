#!/usr/bin/env node

/**
 * BaseCryptify - A file-based encryption utility for Node.js
 * Copyright (C) 2020 Mike Chabot
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

const crypto = require('crypto');
if (!crypto) {
  throw new Error('Node.js crypto lib not found');
}

const { run } = require('./lib/cli');
run(process.argv);
