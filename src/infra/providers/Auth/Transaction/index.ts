import { ITransactionAuthProvider } from "src/core/providers/Auth/ITransactionAuth";
import { ICreateTransactionDTO } from "src/core/useCases/Transaction/ICreateTransaction";


export class ProtoTransactionAuthProvider implements ITransactionAuthProvider {
    async auth(createTransactionDTO: ICreateTransactionDTO) {
        const n = Math.round(Math.random()*10)
        if (n > 1.5) { return true }
        else { return false }
    }
}