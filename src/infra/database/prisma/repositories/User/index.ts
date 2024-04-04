import { PrismaService } from "../../prisma.service";
import { Injectable } from "@nestjs/common";
import { create } from "./create";
import { get } from "./get";
import { update } from "./update";
import { IUserRepository } from "src/core/repositories/IUserRepository";


@Injectable()
export class UserRepository implements IUserRepository { 
    constructor( private prisma: PrismaService ) {}
    public create = create
    public get = get
    public update = update
}