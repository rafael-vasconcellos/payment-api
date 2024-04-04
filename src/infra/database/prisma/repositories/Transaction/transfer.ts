import { PrismaService } from "../../prisma.service";
import { Transaction } from "@prisma/client";
import { ITransactionRepository } from "src/core/repositories/ITransactionRepository";


export async function transfer(this: ITransactionRepository & {prisma: PrismaService}, transaction: Transaction) { 
    const [ sender, receiver ] = await Promise.all([
        this.prisma.user.findUnique({
            where: { id: transaction.sender }
        }),
        this.prisma.user.findUnique({
            where: { id: transaction.receiver }
        })
    ])

    return [
        this.prisma.user.update({
            where: { id: transaction.sender },
            data: { balance: sender.balance-transaction.amount }
        }),
        this.prisma.user.update({
            where: { id: transaction.receiver },
            data: { balance: receiver.balance+transaction.amount }
        }),
    ]
}