import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

import logger from './util/logger';

import {isValidCipherAlgorithm, isValidPassword, getSafePassword} from './util/funcs';
import {COMMAND_MODE, DEFAULT, IV_BLOCK_LENGTH, STREAM_EVENT} from './const';

class Cryptify {
    constructor (mode, files, password, algorithm, encoding, obfuscate) {
        if (mode !== COMMAND_MODE.DECRYPT && mode !== COMMAND_MODE.ENCRYPT) {
            throw new Error('Cryptify was instantiated with an unknown mode');
        }

        this.mode = mode;
        this.files = files;
        this.password = password;
        this.algorithm = algorithm || DEFAULT.CIPHER_ALGORITHM;
        this.encoding = encoding || DEFAULT.ENCODING;
        this.obfuscate = obfuscate === true;

        this.key = crypto
            .createHash(DEFAULT.HASH_ALGORITHM)
            .update(this.password)
            .digest();

        this.iv = null;
        this.cipher = null;

        this._validateFiles(this.files);
        this._validatePassword(this.password);
        this._validateCipherAlgorithm(this.algorithm);
    }

    isEncrypting() {
        return this.mode === COMMAND_MODE.ENCRYPT;
    }

    getModeVerb() {
        return this.isEncrypting() ? 'Encrypting' : 'Decrypting';
    }

    /**
     * Ensure the file exist on the filesystem
     * @param files
     * @private
     */
    _validateFiles (files) {
        if (!Array.isArray(files)
            || files.length === 0
            || !files.every(file => typeof file === 'string')) {
            throw new Error(`Must specify path(s) to file(s), Run "cryptify help ${this.mode}"`);
        }
        files.forEach(file => {
            if (!fs.existsSync(file)) {
                throw new Error(`No such file: ${file}`);
            }
        });
    }

    /**
     * Ensure the password meets complexity requirements
     * @param password
     * @private
     */
    _validatePassword (password) {
        if (!password ||
            typeof password !== 'string' ||
            !isValidPassword(password)
        ) {
            throw new Error(`Invalid password, Run "cryptify help ${this.mode}"`);
        }
    }

    /**
     * Ensure the cipher is supported by OpenSSL
     * @param cipher
     * @private
     */
    _validateCipherAlgorithm (algorithm) {
        if (!algorithm ||
            typeof algorithm !== 'string' ||
            !isValidCipherAlgorithm(algorithm)
        ) {
            throw new Error(`Invalid cipher: "${algorithm}", Run "cryptify --list"`);
        }
    }

    getFilePaths(file) {
        const iPath = path.join(file);
        const oPath = path.join(`${file}.${DEFAULT.EXTENSION}`);

        return {iPath, oPath};
    }

    async getEncryptionStreams(file) {
        const {iPath, oPath} = this.getFilePaths(file);

        const iStream = fs.createReadStream(iPath);
        let oStream = fs.createWriteStream(oPath);

        this.iv = crypto.randomBytes(IV_BLOCK_LENGTH);
        this.cipher = this._generateCipher(this.iv);

        oStream.write(this.iv);

        return {iStream, oStream, iPath, oPath};
    }

    async getDecryptionSteams(file) {
        const {iPath, oPath} = this.getFilePaths(file);

        this.iv = await this.getIvFromStream(iPath);
        this.cipher = this._generateCipher(this.iv);

        return {
            iPath,
            oPath,
            oStream: fs.createWriteStream(oPath),
            iStream: fs.createReadStream(iPath, {start: IV_BLOCK_LENGTH})
        };
    }

    /**
     * Get the IV that is stored within the encrypted file
     * @param inputPath
     * @returns {Promise<unknown>}
     */
    async getIvFromStream(inputPath) {
        return new Promise(resolve => {
            let iv = null;
            fs.createReadStream(inputPath, {start: 0, end: IV_BLOCK_LENGTH - 1})
                .on(STREAM_EVENT.DATA, persistedIv => iv = persistedIv)
                .on(STREAM_EVENT.CLOSE, () => resolve(iv));
        });
    }

    async execute() {
        let filesRead = 0;

        this.logDetails();

        for (const file of this.files) {

            logger.info(`Working on "${file}"`);

            const streamsGetter = this.isEncrypting()
                ? this.getEncryptionStreams.bind(this)
                : this.getDecryptionSteams.bind(this);

            const {iStream, oStream, iPath, oPath} = await streamsGetter(file);

            const result = await this.processStream(iStream, oStream);

            if (result) {
                fs.renameSync(oPath, iPath);
                if (++filesRead === this.files.length) {
                    logger.info('Processing complete');
                }
            }
        }
    }

    async processStream(iStream, oStream) {
        return new Promise((resolve, reject) => {
            iStream
                .pipe(this.cipher)
                .on(STREAM_EVENT.ERROR, e => reject(e))
                .pipe(oStream)
                .on(STREAM_EVENT.CLOSE, () => resolve(true));
        });
    }

    _generateCipher(iv) {
        return this.isEncrypting()
            ? crypto.createCipheriv(this.algorithm, this.key, iv)
            : crypto.createDecipheriv(this.algorithm, this.key, iv);
    }

    logDetails() {
        logger.blank();
        logger.info(`${this.getModeVerb()} ${this.files.length} file(s) with ${getSafePassword(this.password)}`);
        logger.info(`Cipher: ${this.algorithm}`);
        logger.info(`Encoding: ${this.encoding}`);
    }
}

export default Cryptify;
