import { Transaction } from "src/core/entities/Transaction";
import { IGetUserDTO } from "../User/IGetUser";
import { IAuthorizationHeader } from "../IAuthorizationHeader";

export interface IGetTransaction {
    execute( user: IGetUserDTO & {transactionId?: string}, {Authorization}: IAuthorizationHeader ): Promise<Transaction[] | Transaction>
}


