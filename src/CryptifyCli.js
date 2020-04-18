import CryptifyBase from './CryptifyBase';

class CryptifyCli extends CryptifyBase {
    constructor(mode, options) {
        const {args, password, cipher, encoding, silent} = options;

        super(args, password, cipher, encoding, silent);

        this.mode = mode;
        this.returnResults = false;
    }
}

export default CryptifyCli;
