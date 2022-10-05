import { Inject, Injectable } from '@nestjs/common';

import {
  CreateTransactionResult,
  TransactionDto,
  CreateTransactionStatus as ServiceCreateTransactionStatus,
} from './transaction.dto';
import {
  TransactionPort,
  TRANSACTION_PORT,
  CreateTransactionStatus as DbCreateTransactionStatus,
} from '../../../libs/src/db';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(TRANSACTION_PORT) private transactionPort: TransactionPort,
  ) {}

  async createTransaction(
    transactionDto: TransactionDto,
  ): Promise<CreateTransactionResult> {
    const result = await this.transactionPort.createTransaction(transactionDto);
    if (result.status === DbCreateTransactionStatus.OK) {
      return {
        status: ServiceCreateTransactionStatus.OK,
        uuid: result.uuid,
      };
    }
    if (result.status === DbCreateTransactionStatus.UNIQUE_VIOLATION) {
      return {
        status: ServiceCreateTransactionStatus.PROPAGABLE_ERROR,
        errorMessage: result.errorMessage,
      };
    }
    return {
      status: ServiceCreateTransactionStatus.NON_PROPAGABLE_ERROR,
    };
  }
}
