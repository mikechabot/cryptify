import CryptifyBase from './CryptifyBase';
import {COMMAND_MODE} from './const';

class CryptifyModule extends CryptifyBase {
    constructor(files, password, cipher, encoding) {
        super(typeof files === 'string' ? [files] : files, password, cipher, encoding);

        this.isModule = true;
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

export default CryptifyModule;
