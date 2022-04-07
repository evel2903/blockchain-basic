import { Blockchain } from "./blockchain";


const myChain = new Blockchain(8)
myChain.addBlock({
    from: 'sang',
    to: 'quyen',
    amount: 100
})
myChain.addBlock({
    from: 'trong',
    to: 'quyen',
    amount: 200
})
myChain.addBlock({ dob: '20210531' })

console.log(myChain.chain);
