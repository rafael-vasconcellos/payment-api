export class UserTypeError extends Error {
    constructor() {
        super("Merchants can't transfer!")
    }
}