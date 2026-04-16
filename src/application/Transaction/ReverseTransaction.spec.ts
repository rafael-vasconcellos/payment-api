import { randomUUID } from "node:crypto"
import { Transaction } from "src/core/entities/Transaction"
import { User } from "src/core/entities/User"
import { ITransactionRepository } from "src/core/repositories/ITransactionRepository"
import { IUserRepository } from "src/core/repositories/IUserRepository"
import { DatabaseError } from "../Errors/Database"
import { RevertingError } from "../Errors/Transaction/Reverting"
import { NotFound } from "../Errors/Transaction/NotFound"
import { Unauthorized } from "../Errors/Unauthorized"
import { UserDatabaseError } from "../Errors/User/Database"
import { ReverseTransaction } from "./ReverseTransaction"

describe("ReverseTransaction", () => {
    let reverseTransaction: ReverseTransaction
    let transactionRepo: jest.Mocked<ITransactionRepository>
    let userRepo: jest.Mocked<IUserRepository>

    const senderId = randomUUID()
    const receiverId = randomUUID()
    const transactionId = randomUUID()

    const sender: User = {
        id: senderId,
        document: "12344425603",
        type: "COMMON",
        name: "leona",
        email: "example3@example.com",
        pass: "example3",
        balance: 1000,
    }

    const transaction: Transaction = {
        id: transactionId,
        sender: senderId,
        receiver: receiverId,
        amount: 100,
        time: new Date(),
    }

    beforeEach(() => {
        transactionRepo = {
            get: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
        }

        userRepo = {
            create: jest.fn(),
            get: jest.fn(),
            update: jest.fn(),
        }

        reverseTransaction = new ReverseTransaction(transactionRepo, userRepo)
    })

    it("should throw database error when transaction lookup fails", async () => {
        transactionRepo.get.mockRejectedValue(new Error("db error"))

        await expect(
            reverseTransaction.execute(transactionId, {} as any)
        ).rejects.toThrow(DatabaseError)
    })

    it("should throw not found when transaction does not exist", async () => {
        transactionRepo.get.mockResolvedValue(undefined as any)
        userRepo.get.mockResolvedValue(undefined as any)

        await expect(
            reverseTransaction.execute(
                transactionId,
                { Authorization: "example3@example.com:example3" }
            )
        ).rejects.toThrow(NotFound)
    })

    it("should throw user database error when sender lookup fails", async () => {
        transactionRepo.get.mockResolvedValue(transaction)
        userRepo.get.mockRejectedValue(new Error("db error"))

        await expect(
            reverseTransaction.execute(
                transactionId,
                { Authorization: "example3@example.com:example3" }
            )
        ).rejects.toThrow(UserDatabaseError)
    })

    it("should reject invalid credentials", async () => {
        transactionRepo.get.mockResolvedValue(transaction)
        userRepo.get.mockResolvedValue(sender)

        await expect(
            reverseTransaction.execute(
                transactionId,
                { Authorization: "wrong@example.com:wrongpass" }
            )
        ).rejects.toThrow(Unauthorized)

        expect(transactionRepo.delete).not.toHaveBeenCalled()
    })

    it("should revert the transaction for the authenticated sender", async () => {
        const revertedTransactions: Transaction[] = []

        transactionRepo.get.mockResolvedValue(transaction)
        userRepo.get.mockResolvedValue(sender)
        transactionRepo.delete.mockResolvedValue(revertedTransactions)

        await expect(
            reverseTransaction.execute(
                transactionId,
                { Authorization: `${sender.email}:${sender.pass}` }
            )
        ).resolves.toEqual(revertedTransactions)

        expect(transactionRepo.delete).toHaveBeenCalledWith(transactionId)
    })

    it("should throw reverting error when delete fails", async () => {
        transactionRepo.get.mockResolvedValue(transaction)
        userRepo.get.mockResolvedValue(sender)
        transactionRepo.delete.mockRejectedValue(new Error("delete error"))

        await expect(
            reverseTransaction.execute(
                transactionId,
                { Authorization: `${sender.email}:${sender.pass}` }
            )
        ).rejects.toThrow(RevertingError)
    })
})
