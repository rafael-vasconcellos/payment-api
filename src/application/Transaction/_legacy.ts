import { Transaction } from "src/core/entities/Transaction";
import { User } from "src/core/entities/User";
import { ITransactionRepository } from "src/core/repositories/ITransactionRepository";
import { IUserRepository } from "src/core/repositories/IUserRepository";
import { ICreateTransactionDTO } from "src/core/useCases/Transaction/ICreateTransaction";


type ITransationProps = {
    sender: User,
    receiver: User,
}

export async function transact(
    this: {userRepo: IUserRepository, transactionRepo: ITransactionRepository, sendMail: (sender: User, receiver: User, transaction: Transaction) => Promise<void>}, 
    { sender, receiver, dbEntry }: ITransationProps & { dbEntry: Transaction }
) {
    return await this.userRepo.update({ 
        id: receiver.id,
        balance: receiver.balance+dbEntry.amount
    } ).then( () => { 
            this.userRepo.update({
                id: sender.id,
                balance: sender.balance-dbEntry.amount
            } )
            .then( () => this.sendMail(sender, receiver, dbEntry) ).catch(e => { 
                console.log({
                    error: "error while discounting from the transaction's sender",
                    transaction: dbEntry,
                    message: e
                })
            } )


    } )


    const transaction = {} as any
    this.transactionRepo.create(transaction).then(response => { 
        transact.call(this, {sender, receiver, response}).catch( async() => { 
            this.transactionRepo.delete(response.id).catch(e => { 
                console.log({
                    error: "error while deleting a failed transaction entry",
                    transaction: response,
                    message: e
                })
            } )

            throw new Error('Error while effectuating the transaction!')
        } )


        return response

    } )


    const promise = transact.call(this, {receiver: sender, sender: receiver, dbEntry: transaction}) as Promise<void>
        await promise.then( async() => { 
            return await this.transactionRepo.delete('')
            .catch(e => {
                console.log({
                    error: "Error deleting the transaction's Entry!",
                    message: e,
                    transaction
                })
            })
        } )
        .catch(e => {
            throw new Error(JSON.stringify({
                error: "Couldn't revert transaction!",
                message: e
            }))
        })

        return await this.transactionRepo.get( {sender: sender.id} )
}


async function validateTransaction({sender, receiver, authorization}: ITransationProps & { authorization: string }) {}