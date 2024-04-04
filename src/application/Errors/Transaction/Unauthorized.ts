export class TransactionUnauthorized extends Error {
    constructor() {
        super('Transaction Unauthorized!')
    }
}