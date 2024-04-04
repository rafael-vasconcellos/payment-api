import { PrismaService } from "../../prisma.service";
import { Transaction } from "src/core/entities/Transaction";
import { ITransactionRepository } from "src/core/repositories/ITransactionRepository";


export const get: ITransactionRepository['get'] = async function(
        this: ITransactionRepository & {prisma: PrismaService}, transaction: Partial<Transaction>
    ): Promise<Transaction[] | Transaction> { 

    const response = await this.prisma.transaction.findMany({
        where: transaction
    })

    return response.length>1 || !response[0]? response : response[0]
}