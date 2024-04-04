import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUUID, Length } from "class-validator";
import { User } from "src/core/entities/User";
import { IAuthorizationHeader } from "../IAuthorizationHeader";

export interface IGetUser {
    execute(user: IGetUserDTO, {Authorization}: IAuthorizationHeader): Promise<User>
}

export class IGetUserDTO { 
    @IsOptional()
    @IsString()
    @IsUUID()
    public id?: string
    @IsOptional()
    @IsNumberString()
    @Length(11)
    public document?: string;
    @IsOptional()
    @IsString()
    @IsIn(["COMMON", "MERCHANT"])
    @Length(6, 8)
    public type?: "COMMON" | "MERCHANT";
    @IsOptional()
    @IsString()
    @Length(3)
    public name?: string;
    public lastname?: string;
    @IsOptional()
    @IsString()
    @IsEmail()
    public email?: string;
    @IsOptional()
    @IsString()
    @Length(8, 16)
    public pass?: string;
    @IsOptional()
    @IsNumber()
    public balance?: number

}