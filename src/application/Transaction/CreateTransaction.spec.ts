import { randomUUID } from "node:crypto"
import { User } from "src/core/entities/User"
import { Transaction } from "src/core/entities/Transaction"
import { ITransactionAuthProvider } from "src/core/providers/Auth/ITransactionAuth"
import { IMailProvider } from "src/core/providers/IMailProvider"
import { ITransactionRepository } from "src/core/repositories/ITransactionRepository"
import { IUserRepository } from "src/core/repositories/IUserRepository"
import { AmountError } from "../Errors/Transaction/Amount"
import { BalanceError } from "../Errors/Transaction/Balance"
import { UserTypeError } from "../Errors/Transaction/UserType"
import { CreateTransaction } from "./CreateTransaction"
import { NotFound } from "../Errors/User/NotFound"
import { Unauthorized } from "../Errors/Unauthorized"

describe("CreateTransaction", () => {
    let createTransaction: CreateTransaction
    let userRepo: jest.Mocked<IUserRepository>
    let transactionRepo: jest.Mocked<ITransactionRepository>
    let transactionAuthProvider: jest.Mocked<ITransactionAuthProvider>
    let mailProvider: jest.Mocked<IMailProvider>

    const senderId = randomUUID()
    const receiverId = randomUUID()

    const commonSender: User = {
        id: senderId,
        document: "12344425603",
        type: "COMMON",
        name: "leona",
        email: "example3@example.com",
        pass: "example3",
        balance: 1000,
    }

    const commonReceiver: User = {
        id: receiverId,
        document: "12344425608",
        type: "COMMON",
        name: "rafael",
        email: "example@example.com",
        pass: "example1",
        balance: 0,
    }

    const merchantSender: User = {
        ...commonSender,
        type: "MERCHANT",
        email: "merchant@example.com",
        pass: "merchant1",
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

        transactionAuthProvider = {
            auth: jest.fn(),
        }

        mailProvider = {
            sendMail: jest.fn(),
        }

        createTransaction = new CreateTransaction(
            userRepo,
            transactionRepo,
            transactionAuthProvider,
            mailProvider
        )
    })

    it("should fail DTO validation before hitting the database", async () => {
        await expect(
            createTransaction.execute({} as any, {} as any)
        ).rejects.toThrow()

        expect(userRepo.get).not.toHaveBeenCalled()
        expect(transactionAuthProvider.auth).not.toHaveBeenCalled()
        expect(transactionRepo.create).not.toHaveBeenCalled()
    })

    it("should reject non-positive amounts before hitting external dependencies", async () => {
        await expect(
            createTransaction.execute(
                {
                    sender: senderId,
                    receiver: receiverId,
                    amount: 0,
                },
                { Authorization: "example3@example.com:example3" }
            )
        ).rejects.toThrow(AmountError)

        expect(userRepo.get).not.toHaveBeenCalled()
        expect(transactionAuthProvider.auth).not.toHaveBeenCalled()
        expect(transactionRepo.create).not.toHaveBeenCalled()
    })

    it("should fail when sender does not exist", async () => {
        userRepo.get
            .mockResolvedValueOnce(undefined as any)
            .mockResolvedValueOnce(commonReceiver)

        await expect(
            createTransaction.execute(
                {
                    sender: senderId,
                    receiver: receiverId,
                    amount: 100,
                },
                { Authorization: "example3@example.com:example3" }
            )
        ).rejects.toThrow(NotFound)

        expect(transactionAuthProvider.auth).not.toHaveBeenCalled()
        expect(transactionRepo.create).not.toHaveBeenCalled()
    })

    it("should fail when receiver does not exist", async () => {
        userRepo.get
            .mockResolvedValueOnce(commonSender)
            .mockResolvedValueOnce(undefined as any)

        await expect(
            createTransaction.execute(
                {
                    sender: senderId,
                    receiver: receiverId,
                    amount: 100,
                },
                { Authorization: "example3@example.com:example3" }
            )
        ).rejects.toThrow(NotFound)

        expect(transactionAuthProvider.auth).not.toHaveBeenCalled()
        expect(transactionRepo.create).not.toHaveBeenCalled()
    })

    it("should reject merchant senders", async () => {
        userRepo.get
            .mockResolvedValueOnce(merchantSender)
            .mockResolvedValueOnce(commonReceiver)

        await expect(
            createTransaction.execute(
                {
                    sender: merchantSender.id,
                    receiver: receiverId,
                    amount: 100,
                },
                { Authorization: "merchant@example.com:merchant1" }
            )
        ).rejects.toThrow(UserTypeError)

        expect(transactionAuthProvider.auth).not.toHaveBeenCalled()
        expect(transactionRepo.create).not.toHaveBeenCalled()
    })

    it("should reject invalid credentials", async () => {
        userRepo.get
            .mockResolvedValueOnce(commonSender)
            .mockResolvedValueOnce(commonReceiver)

        await expect(
            createTransaction.execute(
                {
                    sender: senderId,
                    receiver: receiverId,
                    amount: 100,
                },
                { Authorization: "wrong@example.com:wrongpass" }
            )
        ).rejects.toThrow(Unauthorized)

        expect(transactionAuthProvider.auth).not.toHaveBeenCalled()
        expect(transactionRepo.create).not.toHaveBeenCalled()
    })

    it("should reject when sender balance is insufficient", async () => {
        userRepo.get
            .mockResolvedValueOnce({
                ...commonSender,
                balance: 50,
            })
            .mockResolvedValueOnce(commonReceiver)

        await expect(
            createTransaction.execute(
                {
                    sender: senderId,
                    receiver: receiverId,
                    amount: 100,
                },
                { Authorization: "example3@example.com:example3" }
            )
        ).rejects.toThrow(BalanceError)

        expect(transactionAuthProvider.auth).not.toHaveBeenCalled()
        expect(transactionRepo.create).not.toHaveBeenCalled()
    })

    it("should stop when the external authorizer denies the transaction", async () => {
        userRepo.get
            .mockResolvedValueOnce(commonSender)
            .mockResolvedValueOnce(commonReceiver)
        transactionAuthProvider.auth.mockResolvedValue(false)

        await expect(
            createTransaction.execute(
                {
                    sender: senderId,
                    receiver: receiverId,
                    amount: 100,
                },
                { Authorization: "example3@example.com:example3" }
            )
        ).rejects.toThrow("Unauthorized!")

        expect(transactionAuthProvider.auth).toHaveBeenCalledTimes(1)
        expect(transactionRepo.create).not.toHaveBeenCalled()
    })

    it("should create the transaction and send both notifications", async () => {
        let createdTransaction: Transaction | undefined

        userRepo.get
            .mockResolvedValueOnce(commonSender)
            .mockResolvedValueOnce(commonReceiver)
        transactionAuthProvider.auth.mockResolvedValue(true)
        mailProvider.sendMail.mockResolvedValue(undefined)
        transactionRepo.create.mockImplementation(async (transaction) => {
            createdTransaction = transaction
            return transaction
        })

        const response = await createTransaction.execute(
            {
                sender: senderId,
                receiver: receiverId,
                amount: 100,
            },
            { Authorization: "example3@example.com:example3" }
        )

        expect(response.id).toBeTruthy()
        expect(response.amount).toBe(100)
        expect(response.sender).toBe(senderId)
        expect(response.receiver).toBe(receiverId)
        expect(createdTransaction).toEqual(response)
        expect(transactionRepo.create).toHaveBeenCalledTimes(1)
        expect(mailProvider.sendMail).toHaveBeenCalledTimes(2)
    })

    it("should still succeed when notifications fail", async () => {
        userRepo.get
            .mockResolvedValueOnce(commonSender)
            .mockResolvedValueOnce(commonReceiver)
        transactionAuthProvider.auth.mockResolvedValue(true)
        transactionRepo.create.mockImplementation(async (transaction) => transaction)
        mailProvider.sendMail.mockRejectedValue(new Error("mail unavailable"))

        const response = await createTransaction.execute(
            {
                sender: senderId,
                receiver: receiverId,
                amount: 100,
            },
            { Authorization: "example3@example.com:example3" }
        )

        expect(response.id).toBeTruthy()
        expect(transactionRepo.create).toHaveBeenCalledTimes(1)
        expect(mailProvider.sendMail).toHaveBeenCalledTimes(2)
    })
})
