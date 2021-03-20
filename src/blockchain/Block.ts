import { GENESIS_DATA } from '../config/config';
export class Block {
    constructor(private _timestamp: Number, private _lastHash: String, private _hash: String, private _data: Array<String>) { }

    static genesis(): Block {
        const { timestamp, lastHash, hash, data } = GENESIS_DATA;
        return new this(timestamp, lastHash, hash, data);
    }

    static mine(lastBlock: Block, newData: String): Block {
        return new this(Date.now(), lastBlock.hash, 'new-hash', [newData]);
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



