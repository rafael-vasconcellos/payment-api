import { Injectable } from "@nestjs/common"
import { User } from "src/core/entities/User"
import { IUserRepository } from "src/core/repositories/IUserRepository"
import { IAuthorizationHeader } from "src/core/useCases/IAuthorizationHeader"
import { IGetUser, IGetUserDTO } from "src/core/useCases/User/IGetUser"
import { DatabaseError } from "../Errors/Database"
import { NotFound } from "../Errors/User/NotFound"


@Injectable()
export class GetUser implements IGetUser { 
    constructor( private userRepo: IUserRepository ) {}

    async execute(user: IGetUserDTO, authorizationHeader?: IAuthorizationHeader): Promise<User> { 
        const result: User | undefined = await this.userRepo.get(user)
        .catch(() => {throw new DatabaseError()} )
        const { Authorization } = authorizationHeader ?? {}
        const [ headerEmail, headerPass ] = typeof Authorization==='string'? Authorization?.split(":") : []

        if( (headerEmail !== result?.email || headerPass !== result?.pass) && result?.id) {
            delete result.document
            delete result.email
            delete result.pass
            delete result.balance
            return result

        } else if(result?.id) { 
            delete result.pass
            return result 
        } 
        else { throw new NotFound() }


    }

}



