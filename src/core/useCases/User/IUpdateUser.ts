import { User } from "src/core/entities/User";
import { IGetUserDTO } from "./IGetUser";
import { IAuthorizationHeader } from "../IAuthorizationHeader";

export interface IUpdateUser {
    execute(user: IGetUserDTO, {Authorization}: IAuthorizationHeader): Promise<User>
}