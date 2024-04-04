import { IsNotEmpty, IsString } from "class-validator";

export class IAuthorizationHeader { 
    @IsNotEmpty()
    @IsString()
    public Authorization: string
}