export class TransactionError extends Error {
    constructor() {
        super('Error while effectuating the transaction!')
    }
}