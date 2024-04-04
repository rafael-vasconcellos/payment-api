export class RevertingError extends Error {
    constructor() {
        super('Error while reverting transaction!')
    }
}