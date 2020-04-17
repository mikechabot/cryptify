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

(async () => {
    for (let i=0; i < ciphers.length; i++) {
        const cipher = ciphers[i];

        if (blacklisted.includes(cipher)) {
            continue;
        }

        if (!fs.existsSync(TEST_DIRECTORY)){
            fs.mkdirSync(TEST_DIRECTORY);
        }

        const filepath = createDummyFileAndReturnPath(cipher);

        try {
            logger.blank();
            logger.info(`Testing ${cipher}`);

            const instance = new CryptifyModule(filepath, PASSWORD, cipher);
            await instance.encrypt();
            const decrypted = await instance.decrypt();

            console.log(decrypted[0]);
        } catch (e) {
            // logger.error(new Error(`Failed on ${e}`));
        }

    }

    return Promise.resolve();
})();
