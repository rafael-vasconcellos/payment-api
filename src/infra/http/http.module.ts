import { Module } from "@nestjs/common";
import { AppController } from "./controllers/app.controller";
import { UserController } from "./controllers/user/user.controller";
import { TransactionController } from "./controllers/transaction/transaction.controller";
import { CreateTransaction } from "src/application/Transaction/CreateTransaction";
import { GetTransaction } from "src/application/Transaction/GetTransaction";
import { ReverseTransaction } from "src/application/Transaction/ReverseTransaction";
import { CreateUser } from "src/application/User/CreateUser";
import { GetUser } from "src/application/User/GetUser";
import { UpdateUser } from "src/application/User/UpdateUser";
import { MailTrapProvider } from "../providers/MailTrap";
import { IMailProvider } from "src/core/providers/IMailProvider";
import { DatabaseModule } from "../database/database.module";



@Module({ 
    imports: [DatabaseModule],
    providers: [ 
        CreateUser, GetUser, UpdateUser, 
        CreateTransaction, GetTransaction, ReverseTransaction, 
        {
            provide: IMailProvider,
            useClass: MailTrapProvider
        }
    ],
    controllers: [AppController, UserController, TransactionController]
})
export class HttpModule {}



