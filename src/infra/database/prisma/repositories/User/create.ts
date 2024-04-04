import { PrismaService } from "../../prisma.service";
import { User } from "src/core/entities/User";
import { IUserRepository } from "src/core/repositories/IUserRepository";


export const create: IUserRepository['create'] = async function(this: IUserRepository & {prisma: PrismaService}, user: User): Promise<User> {
    return await this.prisma.user.create({
        data: user
    })
}