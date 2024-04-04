import { Injectable } from "@nestjs/common";
import { IMailProvider, IMessage } from "src/core/providers/IMailProvider"
import * as nodemailer from 'nodemailer';
import Mail from "nodemailer/lib/mailer";


@Injectable()
export class MailTrapProvider implements IMailProvider { 
    private transporter: Mail
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: process.env.PORT,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        } as nodemailer.TransportOptions)
    }

    async sendMail(message: IMessage) {
        try { 
            return await this.transporter.sendMail( { 
                from: {
                    name: message.from.name,
                    address: message.from.email
                },

                to: {
                    name: message.to.name,
                    address: message.to.email
                },

                subject: message.subject,
                html: message.body
            } )

        } catch(e) { throw new Error(e) }

    }
}