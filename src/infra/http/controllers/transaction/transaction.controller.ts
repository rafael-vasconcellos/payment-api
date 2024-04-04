import { Body, Controller, Delete, Get, Headers, Post, Query } from "@nestjs/common";
import { CreateTransaction } from "src/application/Transaction/CreateTransaction";
import { GetTransaction } from "src/application/Transaction/GetTransaction";
import { ReverseTransaction } from "src/application/Transaction/ReverseTransaction";
import { IAuthorizationHeader } from "src/core/useCases/IAuthorizationHeader";
import { ICreateTransactionDTO } from "src/core/useCases/Transaction/ICreateTransaction";
import { IReverseTransactionDTO } from "src/core/useCases/Transaction/IReverseTransaction";
import { IGetUserDTO } from "src/core/useCases/User/IGetUser";



@Controller('api/transaction')
export class TransactionController { 
    constructor( 
        private getTransaction: GetTransaction, 
        private createTransaction: CreateTransaction, 
        private reverseTransaction: ReverseTransaction
    ) {}


    @Post()
    async post(@Body() transaction: ICreateTransactionDTO, @Headers() headers) { 
        const authorization = await IAuthorizationHeader.validate(headers)
        return await this.createTransaction.execute(transaction, authorization)
        .catch(e => { 
            return {error: e.message}
        } )
    }

    @Delete()
    async delete(@Query() queryParams: IReverseTransactionDTO, @Headers() headers) { 
        const authorization = await IAuthorizationHeader.validate(headers)
        const { id } = queryParams
        return await this.reverseTransaction.execute(id, authorization)
        .catch(e => { 
            return {error: e.message}
        } )
    }

    @Get()
    async get(@Query() user: IGetUserDTO & {transactionId?: string}, @Headers() headers) { 
        const authorization = await IAuthorizationHeader.validate(headers)
        return await this.getTransaction.execute(user, authorization)
        .catch(e => { 
            return {error: e.message}
        } )
    }

}