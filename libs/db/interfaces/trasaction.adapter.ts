import { TransactionDto, CreateTransactionResult } from '../../dto'

export interface TransactionAdapter {
    createTransaction(transactionDto: TransactionDto): Promise<CreateTransactionResult>;
}

export const TRANSACTION_ADAPTER = Symbol('TRANSACTION_ADAPTER');