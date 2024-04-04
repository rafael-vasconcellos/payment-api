import { Test, TestingModule } from "@nestjs/testing"
import { DatabaseModule } from "src/infra/database/database.module"
import { GetTransaction } from "src/application/Transaction/GetTransaction"
import { UserDatabaseError } from "../Errors/User/Database"
import { NotFound } from "../Errors/User/NotFound"
import { Unauthorized } from "../Errors/Unauthorized"



describe('/transaction (GET) business rules', () => { 
    let getTransaction: GetTransaction
    beforeAll(async() => { 
        const app: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [ GetTransaction ]
        }).compile()

        getTransaction = app.get<GetTransaction>(GetTransaction)
    })


    test('empty object should return prisma error', async() => { 
        expect( async() => {
            await getTransaction.execute({} as any, {} as any)
        })
        .rejects
        .toThrow(UserDatabaseError)
    })

    test('user should not exist', async() => { 
        expect(async() => {
            await getTransaction.execute({
                document: '12345678900',
                email: 'dada'
            }, {} as any)
        })
        .rejects
        .toThrow(NotFound)
    })

    it('should be unauthorized', async() => { 
        expect(async() => {
            await getTransaction.execute({
                email: 'example@example.com',
            }, {} as any)
        })
        .rejects
        .toThrow(Unauthorized)
    })

    it('should return empty', async() => { 
        expect( await getTransaction.execute({
            email: 'example@example.com',
        }, {Authorization: 'example@example.com:example1'})
        ).toStrictEqual([])
    })

})


/*
    get by id and by user
*/