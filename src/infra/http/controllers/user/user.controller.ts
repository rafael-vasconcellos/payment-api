import { Body, Controller, Get, Headers, Post, Put, Query } from "@nestjs/common";
import { CreateUser } from "src/application/User/CreateUser";
import { GetUser } from "src/application/User/GetUser";
import { UpdateUser } from "src/application/User/UpdateUser";
import { IAuthorizationHeader } from "src/core/useCases/IAuthorizationHeader";
import { ICreateUserDTO } from "src/core/useCases/User/ICreateUser";
import { IGetUserDTO } from "src/core/useCases/User/IGetUser";
import { mapApplicationError } from "../mapApplicationError";



@Controller('/api/user')
export class UserController { 
    constructor( 
        private getUser: GetUser, 
        private createUser: CreateUser, 
        private updateUser: UpdateUser
    ) {}


    @Get()
    async get(@Query() user: IGetUserDTO, @Headers() headers: {Authorization: string}) { 
        try {
            return await this.getUser.execute(user, headers)
        } catch (error) {
            mapApplicationError(error)
        }
    }

    @Put()
    async put(@Body() user: IGetUserDTO, @Headers() headers: IAuthorizationHeader) { 
        try {
            const authorization = await IAuthorizationHeader.validate(headers)
            return await this.updateUser.execute(user, authorization)
        } catch (error) {
            mapApplicationError(error)
        }
    }

    @Post()
    async post(@Body() user: ICreateUserDTO) {
        try {
            return await this.createUser.execute(user)
        } catch (error) {
            mapApplicationError(error)
        }
    }

}



