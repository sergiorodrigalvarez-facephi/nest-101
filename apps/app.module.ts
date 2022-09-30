import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

import { TransactionController } from './src/transactions/transaction.controller';
import { TransactionService } from './src/transactions/transaction.service';
import { ConsumerService } from './src/consumer/consumer.service';
import { ProducerController } from './src/producer/producer.controller';
import { ProducerService } from './src/producer/producer.service';
import { TRANSACTION_PORT, EVENT_PORT } from '../libs/src/db/interfaces';
import { TransactionAdapter, EventAdapter } from '../libs/src/db/postgres';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot()
  ],
  controllers: [
    TransactionController, 
    ProducerController
  ],
  providers: [
    TransactionService, 
    ProducerService, 
    ConsumerService, 
    {
      provide: TRANSACTION_PORT,
      useClass: TransactionAdapter
    },
    {
      provide: EVENT_PORT,
      useClass: EventAdapter
    }
  ],
})
export class AppModule {}
