const INITIAL_DIFFICULTY = 3;
export const MINE_RATE = 1000;
export const GENESIS_DATA = {
    nonce: 0,
    difficulty: INITIAL_DIFFICULTY,
    timestamp: Date.now(),
    lastHash: '--------',
    hash: 'hash-one',
    data: []
}