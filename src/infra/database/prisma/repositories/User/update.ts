import { User } from "src/core/entities/User";
import { PrismaService } from "../../prisma.service";
import { IUserRepository } from "src/core/repositories/IUserRepository";


export const update: IUserRepository['update'] = async function update(this: IUserRepository & {prisma: PrismaService}, user: Partial<User>): Promise<User> { 
    //console.log(user)
    return await this.prisma.user.update({
        where: user.document? { document: user.document, } : { email: user.email },
        data: user

    })
}