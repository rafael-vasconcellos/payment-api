import { IsDate, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator"

// 
export class Transaction { 
    constructor(init: Transaction) {
        for(let key in init) {
            this[key] = init[key]
        }
    }

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    public id: string
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    public sender: string
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    public receiver: string
    @IsNotEmpty()
    @IsDate()
    public time: Date
    @IsNotEmpty()
    @IsNumber()
    public amount: number
}