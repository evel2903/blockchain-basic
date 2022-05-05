import dotenv from 'dotenv'
dotenv.config()


import { Blockchain } from "./core/Blockchain"
import { Transaction } from "./core/Transaction"
import EC from "elliptic"
const ec = new EC.ec("secp256k1")

const HOLDER_PUBLIC_ADDRESS = process.env.HOLDER_PUBLIC_ADDRESS
const holderKeyPair = ec.keyFromPrivate(process.env.HOLDER_PRIVATE_KEY, "hex")

const XChain = new Blockchain(4)

const xWallet = ec.genKeyPair()

const xPublicAddress = xWallet.getPublic("hex")


const minerWallet = ec.genKeyPair()
const minerAddress = minerWallet.getPublic("hex")


const transaction = new Transaction(HOLDER_PUBLIC_ADDRESS, xPublicAddress, 1000, 50)
transaction.sign(holderKeyPair)
XChain.addTransaction(transaction)
XChain.mineTransactions(minerAddress)

const transaction1 = new Transaction(HOLDER_PUBLIC_ADDRESS, minerAddress, 1000, 50)
transaction1.sign(holderKeyPair)
XChain.addTransaction(transaction1)
XChain.mineTransactions(minerAddress)

// Prints out balance of both address
console.log("HOLDER balance:", XChain.getBalance(HOLDER_PUBLIC_ADDRESS))
console.log("X's balance:", XChain.getBalance(xPublicAddress))
console.log("Miner balance:", XChain.getBalance(minerAddress))
