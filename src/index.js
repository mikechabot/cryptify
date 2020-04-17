import BaseCryptify from './BaseCryptify';
import {COMMAND_MODE} from './const';

class CryptifyCli extends BaseCryptify {
    constructor(files, password, cipher, encoding) {
        super(files, password, cipher, encoding);

        this.returnResults = true;
    }

    encrypt() {
        this.mode = COMMAND_MODE.ENCRYPT;
        return this.execute();
    }

    decrypt() {
        this.mode = COMMAND_MODE.DECRYPT;
        return this.execute();
    }
}

export default CryptifyCli;
