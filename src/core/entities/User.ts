import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsNumberString, IsString, IsUUID, Length } from "class-validator";


export class User { 
    constructor(init: User) {
        for(let key in init) {
            this[key] = init[key]
        }
    }

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    public id: string
    @IsNotEmpty()
    @IsNumberString()
    @Length(11)
    public document: string
    @IsNotEmpty()
    @IsString()
    @IsIn(["COMMON", "MERCHANT"])
    @Length(6, 8)
    public type: string//"COMMON" | "MERCHANT"
    @IsNotEmpty()
    @IsString()
    @Length(3)
    public name: string
    public lastname?: string
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    public email: string
    @IsNotEmpty()
    @IsString()
    @Length(8, 16)
    public pass: string
    @IsNotEmpty()
    @IsNumber()
    public balance: number
}