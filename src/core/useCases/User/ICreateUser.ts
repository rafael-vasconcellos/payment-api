import { IsEmail, IsIn, IsNotEmpty, IsNumberString, IsOptional, IsString, Length } from "class-validator";
import { User } from "src/core/entities/User";


export interface ICreateUser {
    execute(user: ICreateUserDTO): Promise<User>
}

export class ICreateUserDTO { 
    @IsNotEmpty()
    @IsNumberString()
    @Length(11)
    public document: string;
    @IsNotEmpty()
    @IsString()
    @IsIn(["COMMON", "MERCHANT"])
    @Length(6, 8)
    public type: "COMMON" | "MERCHANT";
    @IsNotEmpty()
    @IsString()
    @Length(3)
    public name: string;
    @IsOptional()
    @IsString()
    public lastname?: string;
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    public email: string;
    @IsNotEmpty()
    @IsString()
    @Length(8, 16)
    public pass: string;

}