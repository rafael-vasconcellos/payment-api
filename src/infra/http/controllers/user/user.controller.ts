import { Body, Controller, Get, Headers, Post, Put, Query } from "@nestjs/common";
import { User } from "@prisma/client";
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
    async get(@Query() user: IGetUserDTO, @Headers() headers: {Authorization: string}): Promise<User> { 
        //console.log(headers)
        return await this.getUser.execute(user, headers)
        .catch(e => { 
            return {error: e.message} as any
        } )
    }

    @Post()
    async post(@Body() user: ICreateUserDTO): Promise<User> {
        return await this.createUser.execute(user)
        .catch(e => { 
            return {error: e.message} as any
        } )
    }

    @Put()
    async put(@Body() user: IGetUserDTO, @Headers() headers: IAuthorizationHeader): Promise<User> {
        return await this.updateUser.execute(user, headers)
        .catch(e => { 
            return {error: e.message} as any
        } )
    }

}



