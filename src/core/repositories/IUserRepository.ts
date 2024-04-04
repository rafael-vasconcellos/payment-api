import { User } from "../entities/User";

export abstract class IUserRepository { 
    abstract create(user: User): Promise<User>
    abstract get(user: Partial<User>): Promise<User>
    abstract update(user: Partial<User>): Promise<User>

}