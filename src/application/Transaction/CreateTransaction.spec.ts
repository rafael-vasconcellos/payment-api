import { Test, TestingModule } from "@nestjs/testing"
import { ConfigModule } from "@nestjs/config"
import { randomUUID } from "node:crypto"
import { DatabaseModule } from "src/infra/database/database.module"
import { MailTrapProvider } from "src/infra/providers/MailTrap"
import { IMailProvider } from "src/core/providers/IMailProvider"
import { User } from "src/core/entities/User"
import { Transaction } from "src/core/entities/Transaction"
import { ITransactionAuthProvider } from "src/core/providers/Auth/ITransactionAuth"
import { ICreateTransactionDTO } from "src/core/useCases/Transaction/ICreateTransaction"
import { CreateTransaction } from "./CreateTransaction"
import { GetUser } from "../User/GetUser"
import { CreateUser } from "../User/CreateUser"
import { UpdateUser } from "../User/UpdateUser"
import { GetTransaction } from "./GetTransaction"
import { ReverseTransaction } from "./ReverseTransaction"
import { NotFound } from "../Errors/User/NotFound"
import { Unauthorized } from "../Errors/Unauthorized"
import { UserDatabaseError } from "../Errors/User/Database"




class TransactionAuthProviderMock implements ITransactionAuthProvider {
    async auth(createTransactionDTO: ICreateTransactionDTO) {
        return true
    }
}


describe('create transaction', () => { 
    let createTransaction: CreateTransaction
    let getUser: GetUser
    let createUser: CreateUser
    let updateUser: UpdateUser
    let getTransaction: GetTransaction
    let reverseTransaction: ReverseTransaction

    beforeAll(async() => { 
        const app: TestingModule = await Test.createTestingModule({
            imports: [ DatabaseModule, ConfigModule.forRoot( {envFilePath: '.env'} ) ],
            providers: [
                GetUser, CreateUser, UpdateUser,
                CreateTransaction, GetTransaction, ReverseTransaction, 
                {
                    provide: IMailProvider,
                    useClass: MailTrapProvider
                }, {
                    provide: ITransactionAuthProvider,
                    useClass: TransactionAuthProviderMock
                }
            ]
        }).compile()

        createTransaction = app.get<CreateTransaction>(CreateTransaction)
        getTransaction = app.get<GetTransaction>(GetTransaction)
        getUser = app.get<GetUser>(GetUser)
        createUser = app.get<CreateUser>(CreateUser)
        updateUser = app.get<UpdateUser>(UpdateUser)
        reverseTransaction = app.get<ReverseTransaction>(ReverseTransaction)
    })



    describe('validations', () => { 
        test('empty object should throw prisma error', () => { 
            expect(async() => { 
                await createTransaction.execute({} as any, {} as any)
            })
            .rejects
            .toThrow(UserDatabaseError)
    
        })
    
        it('should invalidate the input', async() => { 
            expect(await createTransaction.execute({
                    sender: '',
                    receiver: '',
                    amount: 0
                }, {} as any).catch(r => JSON.parse(r?.message)?.length )
    
            ).toBeTruthy()
            //.toContain("has failed the validation")
        })
    
        test("sender doesn't exists", () => { 
            expect(async() => { 
                await createTransaction.execute({
                    sender: randomUUID(),
                    receiver: randomUUID(),
                    amount: 0
                }, {} as any)
            })
            .rejects
            .toThrow(NotFound)
    
        })
    
    
    
    
        // ---------------------------------
        it('should be unauthorized', () => { 
            expect(async() => { 
                const senderQuery = await getUser.execute({
                    document: '12344425608',
                    email: 'example@example.com'
                })
                await createTransaction.execute({
                    sender: senderQuery.id,
                    receiver: '',
                    amount: 0
                }, {} as any)
            })
            .rejects
            .toThrow(Unauthorized)
    
        })
    
        test("receiver doesn't exists", () => { 
            expect(async() => { 
                const senderQuery = await getUser.execute({
                    document: '12344425608',
                    email: 'example@example.com'
                })
                await createTransaction.execute({
                    sender: senderQuery.id,
                    receiver: randomUUID(),
                    amount: 0
                }, {Authorization: 'example@example.com:example1'})
            })
            .rejects
            .toThrow(NotFound)
    
        })
    })










    describe('transactions', () => { 
        let user1: User
        let user2: User
        let user3: User
        beforeAll(async() => { 
            user1 = await getUser.execute( {email: 'example@example.com'} )
            user2 = await getUser.execute( {email: 'example2@example.com'} )
            user3 = await getUser.execute( {email: 'example3@example.com'} )
        })

        test('user type validation', () => { 
            expect(async() => { 
                await createTransaction.execute({
                    sender: user2.id,
                    receiver: user1.id,
                    amount: 50
                }, {Authorization: 'example2@example.com:example2'})
            })
            .rejects
            .toThrow("Merchants can't transfer!")
        })

        test("transaction's amount validation", () => { 
            expect(async() => { 
                await createTransaction.execute({
                    sender: user3.id,
                    receiver: user1.id,
                    amount: 0
                }, {Authorization: 'example3@example.com:example3'})
            })
            .rejects
            .toThrow("Amount is below the minimum!")
        })

        test('balance check validation', () => { 
            expect(async() => { 
                await createTransaction.execute({
                    sender: user3.id,
                    receiver: user1.id,
                    amount: 2000
                }, {Authorization: 'example3@example.com:example3'})
            })
            .rejects
            .toThrow("Not enough balance!")
        })

        it('should carry out the 1st transaction', async() => { 
            expect(await createTransaction.execute({
                    sender: user3.id,
                    receiver: user1.id,
                    amount: 100
                }, {Authorization: 'example3@example.com:example3'})
                .then(r => r?.id)
            )
            .toBeTruthy()
        })

        it('should carry out the 2nd transaction', async() => { 
            expect(await createTransaction.execute({
                    sender: user3.id,
                    receiver: user2.id,
                    amount: 100
                }, {Authorization: 'example3@example.com:example3'})
                .then(r => r?.id)
            )
            .toBeTruthy()
        })

        it('should return the transactions', async() => { 
            expect(
                await getTransaction.execute({
                    id: user3.id
                } as any, {Authorization: 'example3@example.com:example3'} )
                .then( (r: Transaction[]) => r?.length)
            )
            .toBeTruthy()
        })

        it('should revert the transactions', async() => { 
            let transactionList = await getTransaction.execute({
                id: user3.id
            } as any, {Authorization: 'example3@example.com:example3'} ) as Transaction[]

            for(let transaction of transactionList) {
                await reverseTransaction.execute(transaction?.id, {Authorization: "example3@example.com:example3"})
            }

            transactionList = await getTransaction.execute({
                id: user3.id
            } as any, {Authorization: 'example3@example.com:example3'} ) as Transaction[]

            expect(transactionList).toStrictEqual([])
        })


    })

})






/*
    create: válido e inválido, usuários não existentes
    get: create 2 with the same sender (+3 users required)
    reverse
*/