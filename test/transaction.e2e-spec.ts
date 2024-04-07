import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { IGetUserDTO } from 'src/core/useCases/User/IGetUser';
import { IAuthorizationHeader } from 'src/core/useCases/IAuthorizationHeader';
import { TransactionController } from 'src/infra/http/controllers/transaction/transaction.controller';
import { CreateTransaction } from 'src/application/Transaction/CreateTransaction';
import { GetTransaction } from 'src/application/Transaction/GetTransaction';
import { ReverseTransaction } from 'src/application/Transaction/ReverseTransaction';
import { ICreateTransaction, ICreateTransactionDTO } from 'src/core/useCases/Transaction/ICreateTransaction';
import { IGetTransaction } from 'src/core/useCases/Transaction/IGetTransaction';
import { IReverseTransaction } from 'src/core/useCases/Transaction/IReverseTransaction';
import { Transaction } from 'src/core/entities/Transaction';
import { IMailProvider } from 'src/core/providers/IMailProvider';
import { MailTrapProvider } from 'src/infra/providers/MailTrap';
import { ITransactionAuthProvider } from 'src/core/providers/Auth/ITransactionAuth';
import { ConfigModule } from '@nestjs/config';



class GetTransactionMock implements IGetTransaction {
    async execute(user: IGetUserDTO & { transactionId?: string; }, { Authorization }: IAuthorizationHeader): Promise<Transaction | Transaction[]> {
        return
    }
}

class CreateTransactionMock implements ICreateTransaction {
    async execute(transaction: ICreateTransactionDTO, { Authorization }: IAuthorizationHeader): Promise<Transaction> {
        return
    }
}

class ReverseTransactionMock implements IReverseTransaction {
    async execute(id: string, { Authorization }: IAuthorizationHeader): Promise<Transaction | Transaction[]> {
        return
    }
}

class TransactionAuthProviderMock implements ITransactionAuthProvider {
    async auth(createTransactionDTO: ICreateTransactionDTO): Promise<any> {
        return true
    }
}


describe('/api/transaction', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [ ConfigModule.forRoot( {envFilePath: '.env'} ) ],
        controllers: [TransactionController],
        providers: [ 
            {
                provide: CreateTransaction,
                useClass: CreateTransactionMock
            }, {
                provide: GetTransaction,
                useClass: GetTransactionMock
            }, {
                provide: ReverseTransaction,
                useClass: ReverseTransactionMock
            }, {
                provide: IMailProvider,
                useClass: MailTrapProvider
            }, {
                provide: ITransactionAuthProvider,
                useClass: TransactionAuthProviderMock
            }
        ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });




    it('should fail tha validation (POST)', () => {
        return request(app.getHttpServer())
        .post('/api/transaction')
        .send({})
        .expect(400)
        
    });

    it('should fail tha validation (DELETE)', () => {
        return request(app.getHttpServer())
        .delete('/api/transaction')
        .query({})
        .expect(400)
        
    });

    it('should fail tha validation (GET)', () => {
        return request(app.getHttpServer())
        .get('/api/transaction')
        .query({})
        .expect(400)
        
    });


});



