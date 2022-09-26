import { Inject, Injectable } from '@nestjs/common';

import { CreateTransactionResult, TransactionDto } from '../../../libs/dto';
import { TRANSACTION_ADAPTER } from '../../../libs/db/interfaces';
import { TransactionAdapter } from '../../../libs/db/interfaces';

@Injectable()
export class TransactionService {

  constructor(@Inject(TRANSACTION_ADAPTER) private transactionAdapter: TransactionAdapter) {}

  async createTransaction(body: TransactionDto): Promise<CreateTransactionResult> {
    return await this.transactionAdapter.createTransaction(body);
  }
}
