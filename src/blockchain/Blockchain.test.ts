import { Blockchain } from './Blockchain'
import { Block } from './Block'

describe('Blockchain', () => {
    let blockchain: Blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    })

    it('contains a chain instance array', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    })

    it('starts with genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('add new block to the chain', () => {
        const newData = ['first chain'];
        blockchain.addBlock(newData);
        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    })

    describe('isValidChain()', () => {
        describe('when chain does no starts with genesis block', () => {
            it('return false', () => {
                blockchain.chain[0].data = ['fake-data']
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            })

        })

        describe('when chain starts with genesis block and has multiple blocks', () => {
            beforeEach(() => {
                blockchain.addBlock(['leo']);
                blockchain.addBlock(['test']);
                blockchain.addBlock(['Gandalf']);
            })
            describe('and a lastHash reference has changed', () => {
                it('return false', () => {
                    blockchain.chain[2].lastHash = 'broken-hash';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                })
            });

            describe('and chain contain a block with inalid field', () => {
                it('return false', () => {
                    blockchain.chain[2].data = ['broken-data'];
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                })
            })

            describe('and chain does not contain any invalid block', () => {
                it('return true', () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                })
            })
        })
    })
})