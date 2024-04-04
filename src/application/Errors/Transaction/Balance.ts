export class BalanceError extends Error {
    constructor() {
        super('Not enough balance!')
    }
}