import { Blockchain } from './Blockchain'
import { Block } from './Block'

describe('Blockchain', () => {
    let blockchain: Blockchain;
    let newChain: Blockchain;
    let originalChain: Array<Block>;


    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        originalChain = blockchain.chain
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

    describe('replaceChain()', () => {
        let errorMock: () => {};
        let logMock: () => {};
        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();
            global.console.error = errorMock;
            global.console.log = logMock;
        })
        describe('when the new chain is not longer', () => {
            beforeEach(() => {
                newChain.chain[0].data = ['chain'];
                blockchain.replaceChain(newChain.chain);
            })
            it('does not replace the chain', () => {
                expect(blockchain.chain).toEqual(originalChain);
            });

            it('logs an error', () => {
                expect(errorMock).toHaveBeenCalled();
            })
        })

        describe('when the new chain is longer', () => {
            beforeEach(() => {
                newChain.addBlock(['leo']);
                newChain.addBlock(['test']);
                newChain.addBlock(['Gandalf']);
            })
            describe('and the chain is invalid', () => {
                beforeEach(() => {
                    newChain.chain[2].hash = 'fake-hash';
                    blockchain.replaceChain(newChain.chain);
                })
                it('does not replace the chain', () => {

                    expect(blockchain.chain).toEqual(originalChain);
                })

                it('logs an error', () => {
                    expect(errorMock).toHaveBeenCalled();
                })

            })

            describe('and the chain is valid', () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                })
                it('replaces the chain', () => {
                    expect(blockchain.chain).toEqual(newChain.chain);
                })
                it('logs about the chain replacement', () => {
                    expect(logMock).toHaveBeenCalled();
                })
            })

        })

    })

})