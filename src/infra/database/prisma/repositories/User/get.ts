import { User } from "src/core/entities/User";
import { IUserRepository } from "src/core/repositories/IUserRepository";
import { PrismaService } from "../../prisma.service";

export const get: IUserRepository['get'] = async function get(this: IUserRepository & {prisma: PrismaService}, user: Partial<User>): Promise<User> {
    return await this.prisma.user.findUnique({
        where: { 
            id: user.id,
            document: user.document,
            email: user.email
        }
    })
}