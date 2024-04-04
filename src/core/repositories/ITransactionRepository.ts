import { Transaction } from "../entities/Transaction";

export abstract class ITransactionRepository { 
    abstract get( transaction: Partial<Transaction> ): Promise<Transaction[] | Transaction>
    abstract create(transaction: Transaction): Promise<Transaction>
    abstract delete(id: string): Promise<Transaction[]>
}


