import { Module } from '@nestjs/common';

import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TRANSACTION_ADAPTER } from '../../../libs/db/interfaces';
import { PostgresAdapter } from '../../../libs/db/postgres';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [TransactionService , {
    provide: TRANSACTION_ADAPTER,
    useClass: PostgresAdapter
  }],
})
export class TransactionModule {}
