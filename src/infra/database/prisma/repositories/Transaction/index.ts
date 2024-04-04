import { PrismaService } from "../../prisma.service";
import { Injectable } from "@nestjs/common";
import { create } from "./create";
import { get } from "./get";
import { del } from "./delete";
import { ITransactionRepository } from "src/core/repositories/ITransactionRepository";
import { transfer } from "./transfer";


@Injectable()
export class TransactionRepository implements ITransactionRepository { 
    constructor( private prisma: PrismaService ) {}
    public create = create
    public get = get
    public delete = del
    private transfer = transfer
}