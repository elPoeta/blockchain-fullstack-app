import { GENESIS_DATA } from '../config/config';
import cryptoHash from '../cryptoHash/cryptoHash';
export class Block {
    constructor(private _timestamp: Number, private _lastHash: String, private _hash: String, private _data: Array<String>) { }

    static genesis(): Block {
        const { timestamp, lastHash, hash, data } = GENESIS_DATA;
        return new this(timestamp, lastHash, hash, data);
    }

    static mine(lastBlock: Block, newData: Array<String>): Block {
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        const hash = cryptoHash(timestamp.toString(), lastHash, ...newData);
        return new this(timestamp, lastHash, hash, newData);
    }

    get timestamp(): Number {
        return this._timestamp;
    }

    set timestamp(timestamp: Number) {
        this._timestamp = timestamp;
    }


    get lastHash(): String {
        return this._lastHash;
    }

    set lastHash(lastHash: String) {
        this._lastHash = lastHash;
    }

    get hash(): String {
        return this._hash;
    }

    set hash(hash: String) {
        this._hash = hash;
    }

    get data(): Array<String> {
        return this._data;
    }

    set data(data: Array<String>) {
        this._data = data;
    }

}



