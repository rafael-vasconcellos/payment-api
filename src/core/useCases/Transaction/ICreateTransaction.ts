import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { Transaction } from "src/core/entities/Transaction";
import { IAuthorizationHeader } from "../IAuthorizationHeader";


export abstract class ICreateTransaction {
    abstract execute(transaction: ICreateTransactionDTO, {Authorization}: IAuthorizationHeader): Promise<Transaction>
}

export class ICreateTransactionDTO { 
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    public sender: string
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    public receiver: string
    @IsNotEmpty()
    @IsNumber()
    public amount: number
}
