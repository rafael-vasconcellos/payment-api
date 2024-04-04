export class DatabaseError extends Error {
    constructor() {
        super('Database Error!')
    }
}






/*
    DatabaseError
    Unauthorized

    UserDatabaseError
    UserCreationError
    NotFound (User)

    TransactionError
    NotFound (Transaction)
    RevertingError
    BalanceError
    UserTypeError
    AmountError
*/