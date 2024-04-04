import { Test, TestingModule } from "@nestjs/testing"
import { DatabaseModule } from "src/infra/database/database.module"
import { GetUser } from "src/application/User/GetUser"
import { CreateUser } from "./CreateUser"
import { DatabaseError } from "../Errors/Database"
import { NotFound } from "../Errors/User/NotFound"



describe('/user (GET) business rules', () => { 
    let getUser: GetUser
    let createUser: CreateUser

    beforeAll(async() => { 
        const app: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [ GetUser, CreateUser ]
        }).compile()

        getUser = app.get<GetUser>(GetUser)
        createUser = app.get<CreateUser>(CreateUser)
    })


    test('empty object should return prisma error', async() => { 
        expect(async() => {
            await getUser.execute({} as any, {} as any)
        })
        .rejects
        .toThrow(DatabaseError)
    })

    it('should not find user', async() => { 
        expect(async() => {
            await getUser.execute({
                document: '1234256780'
            }, {} as any)
        })
        .rejects
        .toThrow(NotFound)
    })


    describe('valid user routine', () => { 
        // ----------------------------------------
        it('should return a user', async() => { 
            expect(await getUser.execute({
                email: 'example@example.com',
            }, {} as any).then(r => r?.id)
            ).toBeTruthy()
        })
    })


})



