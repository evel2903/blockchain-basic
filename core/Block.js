import SHA256 from 'crypto-js/sha256'
import { Transaction } from './Transaction'
import dotenv from 'dotenv'
dotenv.config()
const MINT_PUBLIC_ADDRESS = process.env.MINT_PUBLIC_ADDRESS

class Block {
    constructor(prevHash, data = []) {
        this.prevHash = prevHash
        this.data = data
        this.timestamp = new Date()
        this.hash = this.calculateHash()
        this.nonce = 0

    }

    calculateHash() {
        return SHA256(
            this.prevHash +
            this.timestamp +
            JSON.stringify(this.data) +
            this.nonce)
            .toString()
    }

    static calculateHash(block) {
        return SHA256(
            block.prevHash +
            block.timestamp +
            JSON.stringify(block.data) +
            block.nonce)
            .toString()
    }

    mine(difficulty) {
        while (!this.hash.startsWith('0'.repeat(difficulty))) {
            this.nonce += 1
            this.hash = this.calculateHash()
        }
    }

    static hasValidTransactions(block, chain) {
        let gas = 0, reward = 0;

        block.data.forEach(transaction => {
            if (transaction.from !== MINT_PUBLIC_ADDRESS) {
                gas += transaction.gas;
            } else {
                reward = transaction.amount;
            }
        });

        return (
            reward - gas === chain.reward
            // block.data.every(transaction => Transaction.isValid(transaction, chain)) &&
            // block.data.filter(transaction => transaction.from === MINT_PUBLIC_ADDRESS).length === 1
        );
    }
}
export {
    Block
}