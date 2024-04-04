import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { UserRepository } from "./prisma/repositories/User";
import { TransactionRepository } from "./prisma/repositories/Transaction";
import { IUserRepository } from "src/core/repositories/IUserRepository";
import { ITransactionRepository } from "src/core/repositories/ITransactionRepository";


@Module({
    providers: [ 
        PrismaService, 
        {
            provide: IUserRepository,
            useClass: UserRepository
        }, {
            provide: ITransactionRepository,
            useClass: TransactionRepository
        }
    ],
    exports: [ IUserRepository, ITransactionRepository ]
})
export class DatabaseModule {}