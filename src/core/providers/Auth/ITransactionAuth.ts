import { ICreateTransactionDTO } from "src/core/useCases/Transaction/ICreateTransaction";

export abstract class ITransactionAuthProvider {
    abstract auth(createTransactionDTO: ICreateTransactionDTO): Promise<any>
}