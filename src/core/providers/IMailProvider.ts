export interface IAddress {
    name: string
    email: string
}

export interface IMessage {
    from: IAddress
    to: IAddress
    subject: string
    body: string
}

export abstract class IMailProvider {
    abstract sendMail(message: IMessage): Promise<void>
}