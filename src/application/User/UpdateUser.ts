import { Injectable } from "@nestjs/common";
import { User } from "src/core/entities/User";
import { IUserRepository } from "src/core/repositories/IUserRepository";
import { IAuthorizationHeader } from "src/core/useCases/IAuthorizationHeader";
import { IGetUserDTO } from "src/core/useCases/User/IGetUser";
import { IUpdateUser } from "src/core/useCases/User/IUpdateUser";
import { DatabaseError } from "../Errors/Database";
import { NotFound } from "../Errors/User/NotFound";
import { Unauthorized } from "../Errors/Unauthorized";


@Injectable()
export class UpdateUser implements IUpdateUser { 
    constructor( private userRepo: IUserRepository ) {}

    async execute(user: IGetUserDTO, {Authorization}: IAuthorizationHeader): Promise<User> { 
        const query: User | undefined = await this.userRepo.get( 
            user?.document? {document: user?.document} : {email: user?.email}
        )
        .catch(() => {throw new DatabaseError()})
        const userAlreadyExists = query?.id? true : false
        const [ headerEmail, headerPass ] = typeof Authorization==='string'? Authorization?.split(":") : []


        if (userAlreadyExists) { 
            if(headerEmail !== query?.email || headerPass !== query?.pass ) { throw new Unauthorized() }
            const isNewData = Object.keys(user).some(key => user[key] !== query[key])
            if (isNewData) {  return this.userRepo.update( Object.assign(query, user) )  }
            else { return query }
        } else {
            throw new NotFound()
        }

    }
}