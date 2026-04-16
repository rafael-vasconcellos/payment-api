import { randomUUID } from "node:crypto"
import { User } from "src/core/entities/User"
import { Transaction } from "src/core/entities/Transaction"
import { ITransactionRepository } from "src/core/repositories/ITransactionRepository"
import { IUserRepository } from "src/core/repositories/IUserRepository"
import { GetTransaction } from "src/application/Transaction/GetTransaction"
import { UserDatabaseError } from "../Errors/User/Database"
import { NotFound } from "../Errors/User/NotFound"
import { Unauthorized } from "../Errors/Unauthorized"



describe("GetTransaction", () => {
    let getTransaction: GetTransaction
    let userRepo: jest.Mocked<IUserRepository>
    let transactionRepo: jest.Mocked<ITransactionRepository>

    const userId = randomUUID()
    const otherUserId = randomUUID()
    const transactionId = randomUUID()

    const user: User = {
        id: userId,
        document: "12344425603",
        type: "COMMON",
        name: "leona",
        email: "example3@example.com",
        pass: "example3",
        balance: 1000,
    }

    const transaction: Transaction = {
        id: transactionId,
        sender: userId,
        receiver: otherUserId,
        amount: 100,
        time: new Date(),
    }

    beforeEach(() => {
        userRepo = {
            create: jest.fn(),
            get: jest.fn(),
            update: jest.fn(),
        }

        transactionRepo = {
            get: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
        }

        getTransaction = new GetTransaction(userRepo, transactionRepo)
    })

    it("should throw user database error when user lookup fails", async () => {
        userRepo.get.mockRejectedValue(new Error("db error"))

        await expect(getTransaction.execute({} as any, {} as any)).rejects.toThrow(UserDatabaseError)
    })

    it("should throw not found when user does not exist", async () => {
        userRepo.get.mockResolvedValue(undefined as any)

        await expect(
            getTransaction.execute(
                { email: "missing@example.com" },
                { Authorization: "missing@example.com:missing" }
            )
        ).rejects.toThrow(NotFound)
    })

    it("should reject invalid credentials before returning transactions", async () => {
        userRepo.get.mockResolvedValue(user)

        await expect(
            getTransaction.execute(
                { email: user.email },
                { Authorization: "wrong@example.com:wrongpass" }
            )
        ).rejects.toThrow(Unauthorized)

        expect(transactionRepo.get).not.toHaveBeenCalled()
    })

    it("should return transactions for the authenticated sender", async () => {
        const transactions = [transaction]

        userRepo.get.mockResolvedValue(user)
        transactionRepo.get.mockResolvedValue(transactions)

        await expect(
            getTransaction.execute(
                { email: user.email },
                { Authorization: `${user.email}:${user.pass}` }
            )
        ).resolves.toEqual(transactions)

        expect(transactionRepo.get).toHaveBeenCalledWith({ sender: user.id })
    })

    it("should reject transactionId access when credentials are invalid", async () => {
        userRepo.get.mockResolvedValue(user)

        await expect(
            getTransaction.execute(
                { email: user.email, transactionId },
                { Authorization: "wrong@example.com:wrongpass" }
            )
        ).rejects.toThrow(Unauthorized)

        expect(transactionRepo.get).not.toHaveBeenCalled()
    })

    it("should reject transactionId access when the transaction is unrelated to the authenticated user", async () => {
        userRepo.get.mockResolvedValue(user)
        transactionRepo.get.mockResolvedValue({
            ...transaction,
            sender: otherUserId,
            receiver: randomUUID(),
        })

        await expect(
            getTransaction.execute(
                { email: user.email, transactionId },
                { Authorization: `${user.email}:${user.pass}` }
            )
        ).rejects.toThrow(Unauthorized)
    })

    it("should return a transaction by id when it belongs to the authenticated user", async () => {
        userRepo.get.mockResolvedValue(user)
        transactionRepo.get.mockResolvedValue(transaction)

        await expect(
            getTransaction.execute(
                { email: user.email, transactionId },
                { Authorization: `${user.email}:${user.pass}` }
            )
        ).resolves.toEqual(transaction)

        expect(transactionRepo.get).toHaveBeenCalledWith({ id: transactionId })
    })
})
