import { User } from "src/core/entities/User";
import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { validate } from "class-validator";
import { ICreateUser, ICreateUserDTO } from "src/core/useCases/User/ICreateUser";
import { IUserRepository } from "src/core/repositories/IUserRepository";
import { DatabaseError } from "../Errors/Database";
import { UserCeationError } from "../Errors/User/Creation";
import { UserDatabaseError } from "../Errors/User/Database";


@Injectable()
export class CreateUser implements ICreateUser {
    constructor( private userRepo: IUserRepository ) {}

    async execute(userDTO: ICreateUserDTO): Promise<User> { 
        const query: User = await this.userRepo.get(userDTO)
        .catch( () => {throw new DatabaseError()} )
        const userAlreadyExists = query?.id
        
        if (userAlreadyExists) { throw new UserCeationError() }


        const user = new User(
            Object.assign(userDTO, { 
                id: randomUUID(),
                balance: 0
            } )
        )

        const errors = await validate(user)
        if (errors.length) { throw new Error(JSON.stringify(errors)) }

        return await this.userRepo.create(user)
        .catch(e => { //console.log(e)
            throw new UserCeationError()
        } )
    }
}