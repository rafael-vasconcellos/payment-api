import { Test, TestingModule } from "@nestjs/testing"
import { UserController } from "./user.controller"
import { GetUser as GetUserUseCase } from 'src/application/User/GetUser';
import { CreateUser as CreateUserUseCase } from 'src/application/User/CreateUser';
import { UpdateUser as UpdateUserUseCase } from 'src/application/User/UpdateUser';
import { IGetUser, IGetUserDTO } from "src/core/useCases/User/IGetUser"
import { IAuthorizationHeader } from "src/core/useCases/IAuthorizationHeader"
import { ICreateUser, ICreateUserDTO } from "src/core/useCases/User/ICreateUser"
import { User } from "src/core/entities/User"
import { IUpdateUser } from "src/core/useCases/User/IUpdateUser"



class GetUserMock implements IGetUser {
    async execute(user: IGetUserDTO, { Authorization }: IAuthorizationHeader): Promise<User> {
        return
    }
}

class CreateUserMock implements ICreateUser {
    async execute(user: ICreateUserDTO): Promise<User> {
        return
    }
}

class UpdateUserMock implements IUpdateUser {
    async execute(user: IGetUserDTO, { Authorization }: IAuthorizationHeader): Promise<User> {
        return
    }
}


describe('/user business rules', () => { 
    let userController: UserController

    beforeEach(async() => { 
        const app: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [ 
                {
                    provide: GetUserUseCase,
                    useClass: GetUserMock
                }, {
                    provide: CreateUserUseCase,
                    useClass: CreateUserMock
                }, {
                    provide: UpdateUserUseCase,
                    useClass: UpdateUserMock
                }
            ],
        }).compile()

        //
        userController = app.get<UserController>(UserController)
    })


    test('undefined properties should fail the validation', async() => { 
        const falsy = undefined as any
        expect(await userController.post({
            document: '1234442560',
            email: 'example@example.com',
            pass: falsy,
            name: falsy,
            type: falsy
        })//.then( (r:any) => JSON.parse(r?.error)?.length )
        ).toBe(undefined)
    })


})




/*
    validate data input -> e2e

    create: válido e inválido, usuários não existentes
    get: 2 transações, mesmo sender, receiver diferente
    delete
*/