export class NotFound extends Error {
    constructor() {
        super("Transaction doesn't exists!")
    }
}