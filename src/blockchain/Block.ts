
export class Block {
    constructor(private _timestamp: Date, private _lastHash: String, private _hash: String, private _data: String) { }

    get timestamp(): Date {
        return this._timestamp;
    }

    set timestamp(timestamp: Date) {
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

    get data(): String {
        return this._data;
    }

    set data(data: String) {
        this._data = data;
    }
}



