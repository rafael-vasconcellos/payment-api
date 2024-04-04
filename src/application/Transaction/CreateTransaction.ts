import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { Transaction } from "src/core/entities/Transaction";
import { User } from "src/core/entities/User";
import { ITransactionAuthProvider } from "src/core/providers/Auth/ITransactionAuth";
import { IMailProvider } from "src/core/providers/IMailProvider";
import { ITransactionRepository } from "src/core/repositories/ITransactionRepository";
import { IUserRepository } from "src/core/repositories/IUserRepository";
import { IAuthorizationHeader } from "src/core/useCases/IAuthorizationHeader";
import { ICreateTransaction, ICreateTransactionDTO } from "src/core/useCases/Transaction/ICreateTransaction";
import { validate } from "class-validator";
import { Unauthorized } from "../Errors/Unauthorized";
import { AmountError } from "../Errors/Transaction/Amount";
import { BalanceError } from "../Errors/Transaction/Balance";
import { UserTypeError } from "../Errors/Transaction/UserType";
import { NotFound } from "../Errors/User/NotFound";
import { TransactionError } from "../Errors/Transaction";
import { UserDatabaseError } from "../Errors/User/Database";


@Injectable()
export class CreateTransaction implements ICreateTransaction { 
    constructor( 
        private userRepo: IUserRepository, 
        private transactionRepo: ITransactionRepository, 
        private transactionAuthProvider: ITransactionAuthProvider, 
        private mailProvider: IMailProvider
    ) {}

    async execute(transactionDTO: ICreateTransactionDTO, {Authorization}: IAuthorizationHeader): Promise<Transaction> { 
        const [ sender, receiver ] = await Promise.all([
            this.userRepo.get( {id: transactionDTO?.sender} ),
            this.userRepo.get( {id: transactionDTO?.receiver} )
        ]).catch(e => {throw new UserDatabaseError()})
        const transaction = new Transaction(
            Object.assign(transactionDTO, {
                id: randomUUID(),
                time: new Date()
            } )
        )
        const errors = await validate(transaction)
        const isAuthorized = await this.transactionAuthProvider.auth(transactionDTO)
        const [ headerEmail, headerPass ] = typeof Authorization==='string'? Authorization.split(':') : []

        if( (headerEmail !== sender?.email || headerPass !== sender?.pass) && sender?.id) { throw new Unauthorized() }
        else if(errors.length) { throw new Error(JSON.stringify(errors)) }
        else if(!sender?.id) { throw new NotFound() }
        else if (!receiver?.id) { throw new NotFound() }
        else if(sender?.type !== 'COMMON') { throw new UserTypeError() }
        else if(transactionDTO?.amount <= 0) { throw new AmountError() }
        else if(sender?.balance < transactionDTO?.amount) { throw new BalanceError() }
        else if(!isAuthorized) { throw new Error("Unauthorized!") }



        return await this.transactionRepo.create(transaction)
        .then(async(response) => { 
            this.sendMail(sender, receiver, transaction).catch(e => console.log(e))
            return response
        })
        .catch( () => {throw new TransactionError()} )
    }


    private async sendMail(sender: User, receiver: User, transaction: Transaction) {
        return await Promise.all([
            this.mailProvider.sendMail({
                from: {
                    name: 'John Doe Company',
                    email: 'example@example.com'
                },
                to: {
                    name: sender.name,
                    email: sender.email
                },
                subject: "Transaction Done!",
                body: `
                    Your transaction was completed!

                    sender: ${sender.name} - ${sender.document}
                    receiver: ${receiver.name} - ${receiver.document}
                    amount: ${transaction.amount}
                `
            } ),

            this.mailProvider.sendMail({
                from: {
                    name: 'John Doe Company',
                    email: 'example@example.com'
                },
                to: {
                    name: receiver.name,
                    email: receiver.email
                },
                subject: "New Transaction!",
                body: `
                    You received a new transaction!

                    sender: ${receiver.name} - ${receiver.document}
                    receiver: ${sender.name} - ${sender.document}
                    amount: ${transaction.amount}
                `
            } )
        ])


    }
}


