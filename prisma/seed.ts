import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';


const prisma = new PrismaClient();

async function main() {
    await Promise.all([
        prisma.user.create({
            data: {
                document: '12344425608',
                email: 'example@example.com',
                pass: 'example1',
                name: 'rafael',
                type: 'COMMON',

                id: randomUUID(),
                balance: 0
            }
        }),

        prisma.user.create({
            data: {
                document: '12344425602',
                email: 'example2@example.com',
                pass: 'example2',
                type: 'MERCHANT',
                name: 'ana',
    
                id: randomUUID(),
                balance: 0
            }
        }),

        prisma.user.create({
            data: {
                document: '12344425603',
                email: 'example3@example.com',
                pass: 'example3',
                type: 'COMMON',
                name: 'leona',
    
                id: randomUUID(),
                balance: 0
            }
        }),
    ])
}

main()
  .catch((e) => {
    //console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.transaction.deleteMany({})
    await prisma.$disconnect();
  });
