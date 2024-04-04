export class NotFound extends Error {
    constructor() {
        super('User not found!')
    }
}