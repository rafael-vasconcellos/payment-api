export class AmountError extends Error {
    constructor() {
        super('Amount is below the minimum!')
    }
}