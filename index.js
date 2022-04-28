import dotenv from 'dotenv'
dotenv.config()


import { Blockchain } from "./core/Blockchain"
import { Transaction } from "./core/Transaction"
import EC from "elliptic"
const ec = new EC.ec("secp256k1")

const MINT_PUBLIC_ADDRESS = process.env.MINT_PUBLIC_ADDRESS
const HOLDER_PUBLIC_ADDRESS = process.env.HOLDER_PUBLIC_ADDRESS
const MINT_KEY_PAIR = ec.keyFromPrivate(process.env.MINT_PRIVATE_KEY, "hex")
const holderKeyPair = ec.keyFromPrivate(process.env.HOLDER_PRIVATE_KEY, "hex")

const JeChain = new Blockchain()

const xWallet = ec.genKeyPair()
const xPublicAddress = xWallet.getPublic("hex")


const minerWallet = ec.genKeyPair()
const minerAddress = minerWallet.getPublic("hex")


const transaction = new Transaction(HOLDER_PUBLIC_ADDRESS, xPublicAddress, 100, 10)
transaction.sign(holderKeyPair)
// Add transaction to pool
JeChain.addTransaction(transaction)
// Mine transaction
JeChain.mineTransactions(minerAddress)

// Prints out balance of both address
console.log("Your balance:", JeChain.getBalance(HOLDER_PUBLIC_ADDRESS))
console.log("Your X's balance:", JeChain.getBalance(xPublicAddress))
console.log("Your Miner balance:", JeChain.getBalance(minerAddress))
