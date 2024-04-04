import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Transaction } from "src/core/entities/Transaction";
import { IAuthorizationHeader } from "../IAuthorizationHeader";


export interface IReverseTransaction { 
    execute(id: string, {Authorization}: IAuthorizationHeader): Promise<Transaction[] | Transaction>
}

export class IReverseTransactionDTO {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    public id: string
}



