import {
    BadRequestException,
    ConflictException,
    HttpException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common"
import { DatabaseError } from "src/application/Errors/Database"
import { Unauthorized } from "src/application/Errors/Unauthorized"
import { AmountError } from "src/application/Errors/Transaction/Amount"
import { BalanceError } from "src/application/Errors/Transaction/Balance"
import { NotFound as TransactionNotFound } from "src/application/Errors/Transaction/NotFound"
import { RevertingError } from "src/application/Errors/Transaction/Reverting"
import { TransactionUnauthorized } from "src/application/Errors/Transaction/Unauthorized"
import { UserTypeError } from "src/application/Errors/Transaction/UserType"
import { TransactionError } from "src/application/Errors/Transaction"
import { UserCeationError } from "src/application/Errors/User/Creation"
import { UserDatabaseError } from "src/application/Errors/User/Database"
import { NotFound as UserNotFound } from "src/application/Errors/User/NotFound"

export function mapApplicationError(error: unknown): never {
    if (error instanceof HttpException) {
        throw error
    }

    if (
        error instanceof Unauthorized ||
        error instanceof TransactionUnauthorized
    ) {
        throw new UnauthorizedException(error.message)
    }

    if (
        error instanceof UserNotFound ||
        error instanceof TransactionNotFound
    ) {
        throw new NotFoundException(error.message)
    }

    if (
        error instanceof AmountError ||
        error instanceof BalanceError ||
        error instanceof UserTypeError
    ) {
        throw new BadRequestException(error.message)
    }

    if (error instanceof UserCeationError) {
        throw new ConflictException(error.message)
    }

    if (
        error instanceof DatabaseError ||
        error instanceof UserDatabaseError ||
        error instanceof TransactionError ||
        error instanceof RevertingError
    ) {
        throw new InternalServerErrorException(error.message)
    }

    throw new InternalServerErrorException(
        error instanceof Error ? error.message : "Internal server error"
    )
}
