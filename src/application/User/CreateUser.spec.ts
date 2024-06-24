import { Test, TestingModule } from "@nestjs/testing"
import { DatabaseModule } from "src/infra/database/database.module"
import { CreateUser } from "src/application/User/CreateUser"
import { UserCeationError } from "../Errors/User/Creation"
import { DatabaseError } from "../Errors/Database"



describe('/user (POST) business rules', () => { 
    let createUser: CreateUser

    beforeAll(async() => { 
        const app: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [ CreateUser ]
        }).compile()

        createUser = app.get<CreateUser>(CreateUser)
    })


    describe('post', () => { 
        test('undefined properties should fail the validation', async() => { 
            expect(await createUser.execute({ 
                document: '1234442560',
                email: 'example@example.com',
                pass: null,
                name: null,
                type: null
            } as any).catch(e => e?.message?.length)
            ).toBeTruthy()

        })
    
        test('undefined object should return prisma error', async() => { 
            expect(async() => {
                await createUser.execute(undefined as any)
            })
            .rejects
            .toThrow(DatabaseError)
        })
    
        test('empty object should also return prisma error', async() => { 
            expect(async() => {
                await createUser.execute({} as any)
            })
            .rejects
            .toThrow(DatabaseError)
        })
    })



    describe('valid user creation', () => { 
        it('should not recreate a user', async() => { 
            expect(async() => {
                await createUser.execute({
                    document: '12344425608',
                    email: 'example@example.com',
                    pass: 'example1',
                    name: 'rafael',
                    type: 'COMMON',
                })
            })
            .rejects
            .toThrow(UserCeationError)
        })
    })


})

