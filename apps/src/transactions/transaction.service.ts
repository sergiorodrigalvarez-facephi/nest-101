import { Inject, Injectable } from '@nestjs/common';

import { CreateTransactionResult, TransactionDto } from './transaction.dto';
import {
  TransactionPort,
  TRANSACTION_PORT,
} from '../../../libs/src/db/interfaces';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(TRANSACTION_PORT) private transactionPort: TransactionPort,
  ) {}

  async createTransaction(
    transactionDto: TransactionDto,
  ): Promise<CreateTransactionResult> {
    return this.transactionPort.createTransaction(transactionDto);
  }
}
