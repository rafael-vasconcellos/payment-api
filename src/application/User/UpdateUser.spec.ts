import { Test, TestingModule } from "@nestjs/testing"
import { DatabaseModule } from "src/infra/database/database.module"
import { CreateUser } from "src/application/User/CreateUser"
import { UpdateUser } from "src/application/User/UpdateUser"
import { NotFound } from "../Errors/User/NotFound"
import { Unauthorized } from "../Errors/Unauthorized"



describe('/user (PUT) business rules', () => { 
    let updateUser: UpdateUser
    let createUser: CreateUser

    beforeAll(async() => { 
        const app: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [ CreateUser, UpdateUser ]
        }).compile()

        updateUser = app.get<UpdateUser>(UpdateUser)
        createUser = app.get<CreateUser>(CreateUser)
    })


    it('should not find user (/update)', async() => { 
        expect(async() => {
            await updateUser.execute({
                document: '1234256780'
            } as any, {} as any)
        })
        .rejects
        .toThrow(NotFound)
    })



    describe('full routine', () => { 
        it('should be unauthorized', async() => { 
            expect(async() => {
                await updateUser.execute({
                    email: 'example@example.com',
                    type: "MERCHANT"
                }, {} as any)
            })
            .rejects
            .toThrow(Unauthorized)
        })

        it('should return an updated user', async() => { 
            expect(await updateUser.execute({
                email: 'example@example.com',
                type: "MERCHANT",
                pass: 'example1'
            }, {Authorization: 'example@example.com:example1'}).then(r => r?.id)
            ).toBeTruthy()
        })
    })


})



