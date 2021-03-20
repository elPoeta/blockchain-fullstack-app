import cryptoHash from './cryptoHash';

describe('cyptoHash()', () => {
    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('foobar')).toEqual('c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2')
    })

    it('produces the same hash with the same args in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'one', 'two'));
    })
})