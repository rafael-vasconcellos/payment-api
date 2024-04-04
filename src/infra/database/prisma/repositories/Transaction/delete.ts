import { PrismaService } from "../../prisma.service"
import { transfer } from "./transfer"
import { Transaction } from "src/core/entities/Transaction"
import { ITransactionRepository } from "src/core/repositories/ITransactionRepository"


export const del: ITransactionRepository['delete'] = async function(
        this: ITransactionRepository & {prisma: PrismaService, transfer: typeof transfer}, id: string
    ): Promise<Transaction[]> { 

    const query = await this.prisma.transaction.findUnique({
        where: {id}
    })

    await this.prisma.$transaction([
        this.prisma.transaction.delete({
            where: {id}
        }), 
        ...await this.transfer({
            id: query.id,
            amount: query.amount,
            time: query.time,
            sender: query.receiver,
            receiver: query.sender
        })
    ])

    const sender = await this.prisma.user.findUnique({
        where: {id: query.sender}
    })

    return await this.prisma.transaction.findMany({
        where: {sender: sender.id}
    })
}