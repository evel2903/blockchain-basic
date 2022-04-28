import { Block } from './Block'
import { Transaction } from './Transaction'
import EC from "elliptic"
const ec = new EC.ec("secp256k1")

const MINT_PUBLIC_ADDRESS = process.env.MINT_PUBLIC_ADDRESS
const HOLDER_PUBLIC_ADDRESS = process.env.HOLDER_PUBLIC_ADDRESS
const MINT_KEY_PAIR = ec.keyFromPrivate(process.env.MINT_PRIVATE_KEY, "hex")
const holderKeyPair = ec.keyFromPrivate(process.env.HOLDER_PRIVATE_KEY, "hex")

class Blockchain {
    constructor(difficulty) {

        const initialCoinRelease = new Transaction(MINT_PUBLIC_ADDRESS, HOLDER_PUBLIC_ADDRESS, 100000)
        const genesisBlock = new Block('0000', [{ isGenesisBlock: true }, initialCoinRelease])

        this.difficulty = difficulty
        this.chain = [genesisBlock]
        this.transactions = []
        this.reward = 100

    }

    getLastBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(data) {
        const lastBlock = this.getLastBlock()
        const newBlock = new Block(lastBlock.hash, data)

        console.log('Start mining...')
        console.time('mine')
        newBlock.mine(this.difficulty)
        console.timeEnd('mine')
        console.log('End mining...', newBlock)

        this.chain.push(newBlock)
    }

    addTransaction(transaction) {
        if (Transaction.isValid(transaction, this)) {
            this.transactions.push(transaction)
        }
    }

    mineTransactions(rewardAddress) {

        let gas = 0

        this.transactions.forEach(transaction => {
            gas += transaction.gas
        })

        const rewardTransaction = new Transaction(MINT_PUBLIC_ADDRESS, rewardAddress, this.reward + gas)
        rewardTransaction.sign(MINT_KEY_PAIR)

        const dataBlockTransactions = [rewardTransaction, ...this.transactions]

        if (this.transactions.length !== 0) {
            this.addBlock(dataBlockTransactions)
        }

        this.transactions.splice(0, dataBlockTransactions.length - 1)

    }

    getBalance(address) {
        let balance = 0

        this.chain.forEach(block => {
            block.data.forEach(transaction => {
                if (transaction.from === address) {
                    balance -= transaction.amount
                    balance -= transaction.gas
                }

                if (transaction.to === address) {
                    balance += transaction.amount
                }
            })
        })

        return balance
    }

    static isValid(blockchain = this) {
        for (let i = 1; i < blockchain.chain.length; i++) {
            const currentBlock = blockchain.chain[i]
            const prevBlock = blockchain.chain[i - 1]

            if (
                currentBlock.hash !== Block.getHash(currentBlock) ||
                prevBlock.hash !== currentBlock.prevHash ||
                !Block.hasValidTransactions(currentBlock, blockchain)
            ) {
                return false
            }
        }

        return true
    }
}

export {
    Blockchain
}