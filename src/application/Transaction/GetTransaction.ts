import { Injectable } from "@nestjs/common";
import { Transaction } from "src/core/entities/Transaction";
import { User } from "src/core/entities/User";
import { ITransactionRepository } from "src/core/repositories/ITransactionRepository";
import { IUserRepository } from "src/core/repositories/IUserRepository";
import { IAuthorizationHeader } from "src/core/useCases/IAuthorizationHeader";
import { IGetTransaction } from "src/core/useCases/Transaction/IGetTransaction";
import { IGetUserDTO } from "src/core/useCases/User/IGetUser";
import { UserDatabaseError } from "../Errors/User/Database";
import { Unauthorized } from "../Errors/Unauthorized";
import { NotFound } from "../Errors/User/NotFound";


@Injectable()
export class GetTransaction implements IGetTransaction { 
    constructor( 
        private userRepo: IUserRepository,
        private transactionRepo: ITransactionRepository
     ) {}

    async execute(user: IGetUserDTO & { transactionId?: string; }, {Authorization}: IAuthorizationHeader): Promise<Transaction[] | Transaction> { 
        const query: User | undefined = await this.userRepo.get(user)
        .catch(() => {throw new UserDatabaseError()})
        const { transactionId } = user
        const [ headerEmail, headerPass ] = typeof Authorization==='string'? Authorization.split(":") : []

        if (transactionId) {  return this.transactionRepo.get( {id: transactionId} )  }
        else if( (headerEmail !== query?.email || headerPass !== query?.pass) && query?.id ) { throw new Unauthorized() }
        else if (query) {  return await this.transactionRepo.get( {sender: query.id} )  }
        else { throw new NotFound() }

    }
}