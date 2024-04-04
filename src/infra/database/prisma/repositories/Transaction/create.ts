import { PrismaService } from "../../prisma.service";
import { transfer } from "./transfer";
import { Transaction } from "src/core/entities/Transaction";
import { ITransactionRepository } from "src/core/repositories/ITransactionRepository";


export const create: ITransactionRepository['create'] = async function(
        this: ITransactionRepository & {prisma: PrismaService, transfer: typeof transfer}, transaction: Transaction
    ): Promise<Transaction> { 

    await this.prisma.$transaction([
        this.prisma.transaction.create({
            data: transaction
        }),
        ...await this.transfer(transaction)
    ])

    return await this.prisma.transaction.findUnique({
        where: { id: transaction.id }
    })
}