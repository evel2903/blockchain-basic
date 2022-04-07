import hash256 from 'crypto-js/sha256'
class Block {
    constructor(prevHash, data) {
        this.prevHash = prevHash
        this.data = data
        this.createAt = new Date()
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    calculateHash() {
        return hash256(this.prevHash + JSON.stringify(this.data) + this.createAt + this.nonce).toString()
    }
    mine(difficulty) {
        while (!this.hash.startsWith('0'.repeat(difficulty))) {
            this.nonce += 1
            this.hash = this.calculateHash()
        }
    }
}

class Blockchain {
    constructor(difficulty) {
        const genesisBlock = new Block('0000', { isGenesisBlock: true })
        this.difficulty = difficulty
        this.chain = [genesisBlock]
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(data) {
        const lastBlock = this.getLastBlock()
        const newBlock = new Block(lastBlock.hash, data)

        console.log('Start mining...');
        console.time('mine')
        newBlock.mine(this.difficulty)
        console.timeEnd('mine')
        console.log('End mining...', newBlock)

        this.chain.push(newBlock)
    }

    isValid() {
        for (let idx = 1; idx < this.chain.length; idx++) {
            let currBlock = this.chain[idx]
            let prevBlock = this.chain[idx - 1]

            if (currBlock.hash !== currBlock.calculateHash()) return false
            if (currBlock.prevHash !== prevBlock.hash) return false
        }
        return true
    }
}

export {
    Block,
    Blockchain
}