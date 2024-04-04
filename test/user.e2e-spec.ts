import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from 'src/infra/http/controllers/user/user.controller';
import { IGetUser, IGetUserDTO } from 'src/core/useCases/User/IGetUser';
import { User } from 'src/core/entities/User';
import { IAuthorizationHeader } from 'src/core/useCases/IAuthorizationHeader';
import { ICreateUser, ICreateUserDTO } from 'src/core/useCases/User/ICreateUser';
import { IUpdateUser } from 'src/core/useCases/User/IUpdateUser';
import { GetUser as GetUserUseCase } from 'src/application/User/GetUser';
import { CreateUser as CreateUserUseCase } from 'src/application/User/CreateUser';
import { UpdateUser as UpdateUserUseCase } from 'src/application/User/UpdateUser';



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


describe('/api/user', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
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
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });


    it('should fail tha validation (POST)', () => {
        return request(app.getHttpServer())
        .post('/api/user')
        .send({})
        .expect(400)
        
    });

    it('should fail tha validation (PUT)', () => {
        return request(app.getHttpServer())
        .put('/api/user')
        .send({})
        .expect(400)
        
    });

    it('should return 200', () => {
        return request(app.getHttpServer())
        .get('/api/user')
        .query({
            document: '12344425608',
            email: 'example@example.com',
        })
        //.set('Authorization', 'dada')
        .expect(200)
        
    });


});



