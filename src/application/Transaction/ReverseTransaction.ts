import { Injectable } from "@nestjs/common";
import { Transaction } from "src/core/entities/Transaction";
import { ITransactionRepository } from "src/core/repositories/ITransactionRepository";
import { IUserRepository } from "src/core/repositories/IUserRepository";
import { IAuthorizationHeader } from "src/core/useCases/IAuthorizationHeader";
import { IReverseTransaction } from "src/core/useCases/Transaction/IReverseTransaction";
import { DatabaseError } from "../Errors/Database";
import { UserDatabaseError } from "../Errors/User/Database";
import { Unauthorized } from "../Errors/Unauthorized";
import { NotFound } from "../Errors/Transaction/NotFound";
import { RevertingError } from "../Errors/Transaction/Reverting";


@Injectable()
export class ReverseTransaction implements IReverseTransaction { 
    constructor( 
        private transactionRepo: ITransactionRepository,
        private userRepo: IUserRepository
    ) {}

    async execute(id: string, { Authorization }: IAuthorizationHeader): Promise<Transaction[] | Transaction> {
        const transaction = await this.transactionRepo.get( {id} )
        .catch( () => {throw new DatabaseError()} ) as Transaction
        const [ sender ] = await Promise.all([
            this.userRepo.get( {id: transaction?.sender} ).catch( () => {throw new UserDatabaseError()} ),
            //this.userRepo.get( {id: transaction?.receiver} )
        ])
        const [ headerEmail, headerPass ] = typeof Authorization==='string'? Authorization.split(":") : []

        if((headerEmail !== sender?.email || headerPass !== sender.pass) && sender.id) { throw new Unauthorized() }
        if(!transaction?.id) { throw new NotFound() }
        return await this.transactionRepo.delete(id)
        .catch( () => {throw new RevertingError()} )
    }
}



