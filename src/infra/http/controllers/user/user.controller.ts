import { Body, Controller, Get, Headers, Post, Put, Query } from "@nestjs/common";
import { User } from "@prisma/client";
import { ValidationError } from "class-validator";
import { CreateUser } from "src/application/User/CreateUser";
import { GetUser } from "src/application/User/GetUser";
import { UpdateUser } from "src/application/User/UpdateUser";
import { IAuthorizationHeader } from "src/core/useCases/IAuthorizationHeader";
import { ICreateUserDTO } from "src/core/useCases/User/ICreateUser";
import { IGetUserDTO } from "src/core/useCases/User/IGetUser";



@Controller('/api/user')
export class UserController { 
    constructor( 
        private getUser: GetUser, 
        private createUser: CreateUser, 
        private updateUser: UpdateUser
    ) {}


    @Get()
    async get(@Query() user: IGetUserDTO, @Headers() headers: {Authorization: string}): Promise<User | { error: string }> { 
        return await this.getUser.execute(user, headers)
        .catch(e => { 
            return {error: e.message}
        } )
    }

    @Put()
    async put(@Body() user: IGetUserDTO, @Headers() headers: IAuthorizationHeader): Promise<User | ValidationError[] | { error: string }> { 
        const authorization = await IAuthorizationHeader.validate(headers)
        return await this.updateUser.execute(user, authorization)
        .catch(e => { 
            return {error: e.message}
        } )
    }

    @Post()
    async post(@Body() user: ICreateUserDTO): Promise<User | { error: string }> {
        return await this.createUser.execute(user)
        .catch(e => { 
            return {error: e.message}
        } )
    }

}



