import crypto from 'crypto';

const cryptoHash = (...inputs: Array<String>): String => {
    const hash = crypto.createHash('sha256');
    hash.update(inputs.sort().join(' '));
    return hash.digest('hex');
}

export default cryptoHash;
