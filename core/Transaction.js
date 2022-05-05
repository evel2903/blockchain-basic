import SHA256 from 'crypto-js/sha256'
import EC from "elliptic"
const ec = new EC.ec("secp256k1")

const MINT_PUBLIC_ADDRESS = process.env.MINT_PUBLIC_ADDRESS
class Transaction {
    constructor(from, to, amount, gas = 0) {
        this.from = from
        this.to = to
        this.amount = amount
        this.gas = gas
    }

    sign(keyPair) {
        if (keyPair.getPublic("hex") === this.from) {
            //this.signature = keyPair.sign(SHA256(this.from + this.to + this.amount + this.gas).toString(), "base64").toDER("hex")

            let msgHash = SHA256(this.from + this.to + this.amount + this.gas).toString()
            let privKey = keyPair.getPrivate('hex')
            this.signature = ec.sign(msgHash, privKey, "hex", { canonical: true })
        }
    }

    static isValid(tx, chain) {
        return (
            tx.from &&
            tx.to &&
            tx.amount &&
            (chain.getBalance(tx.from) >= tx.amount + tx.gas || tx.from === MINT_PUBLIC_ADDRESS && tx.amount === chain.reward) &&
            ec.keyFromPublic(tx.from, "hex").verify(SHA256(tx.from + tx.to + tx.amount + tx.gas).toString(), tx.signature)
        )
    }
}

export {
    Transaction
}