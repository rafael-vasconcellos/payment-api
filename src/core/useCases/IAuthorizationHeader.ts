import { HttpException, HttpStatus } from "@nestjs/common";
import { IsNotEmpty, IsString, validate } from "class-validator";

export class IAuthorizationHeader { 
    @IsNotEmpty()
    @IsString()
    public Authorization: string

    constructor(init: any) { 
        if(init?.Authorization) {
            this.Authorization = init?.Authorization
        } else { 
            this.Authorization = null
        }
    }

    public static async validate(value: IAuthorizationHeader) { 
        const instance = new IAuthorizationHeader(value)
        const errors = await validate(instance)
        if (errors.length) { throw new HttpException(JSON.stringify(errors), HttpStatus.BAD_REQUEST);
    }
        else { return instance }
    }
}