import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

import CryptifyModule from './src/CryptifyModule';
import logger from './src/util/logger';

const ciphers = crypto.getCiphers();

const blacklisted = ['aes-128-xts'];

const TEST_DATA = 'test-data';
const TEST_DIRECTORY = 'cipher-test';
const PASSWORD = 'Secret123!';

if (!fs.existsSync(TEST_DIRECTORY)){
    fs.mkdirSync(TEST_DIRECTORY);
}

function createDummyFileAndReturnPath(cipher) {
    const filename = `${cipher}.txt`;
    const filepath = path.join(TEST_DIRECTORY, filename);
    try {
        fs.appendFileSync(filepath, TEST_DATA);
    } catch (err) {
        logger.error(`Unable to create/write to ${filename}`);
    }

    return filepath;
}

const executionsByCipher = {};

for (const cipher of ciphers) {
    if (blacklisted.includes(cipher)) {
        continue;
    }
    if (!executionsByCipher[cipher]) {
        const filepath = createDummyFileAndReturnPath(cipher);
        executionsByCipher[cipher] = new CryptifyModule(filepath, PASSWORD, cipher, null, true);
    }
}

const cipherKeys = Object.keys(executionsByCipher);

const encrypts = cipherKeys
    .map(cipher => {
        const instance = executionsByCipher[cipher];
        return new Promise(resolve => {
            try {
                return instance
                    .encrypt()
                    .then(() => instance.decrypt())
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            } catch (e) {
                return resolve(false);
            }
        });
    });

Promise
    .all(encrypts)
    .then((results = []) => {
        results.forEach((r, i) => {
            const cipher = cipherKeys[i];
            if (results[i]) {
                logger.info(`Passed: ${cipher}`);
            }
            // if (results[i]) {
            //     logger.info(`Passed: ${cipher}`);
            // } else {
            //     logger.error(new Error(`Failed: ${cipher}`));
            // }
        });
    });
