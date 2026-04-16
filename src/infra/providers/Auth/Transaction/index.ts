import { ITransactionAuthProvider } from "src/core/providers/Auth/ITransactionAuth";
import { ICreateTransactionDTO } from "src/core/useCases/Transaction/ICreateTransaction";



interface IProviderResponse {
    status: "success" | "fail"
    data: {
        authorization: boolean
    }
}

export class ProtoTransactionAuthProvider implements ITransactionAuthProvider {
    async auth(createTransactionDTO: ICreateTransactionDTO) {
        const response = await fetch("https://util.devi.tools/api/v2/authorize")
        if (!response.ok) return await this.authMock()
        const response_data: IProviderResponse = await response.json()
        return response_data.data.authorization
    }

    async authMock(): Promise<boolean> {
        const n = Math.round(Math.random()*10)
        if (n > 1.5) return true
        return false
    }

}