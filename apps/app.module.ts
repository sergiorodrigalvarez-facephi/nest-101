import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

import { TransactionController } from './src/transactions/transaction.controller';
import { TransactionService } from './src/transactions/transaction.service';
import { ConsumerService } from './src/consumer/consumer.service';
import { ProducerController } from './src/producer/producer.controller';
import { ProducerService } from './src/producer/producer.service';
import { TRANSACTION_PORT, EVENT_PORT } from '../libs/src/db';
import { TransactionAdapter, EventAdapter } from '../libs/src/db/postgres';
import { JSON_SCHEMA_PORT, SCHEMA_REGISTRY_PORT } from '../libs/src/schema';
import { JsonSchemaAdapter, SchemaRegistryAdapter } from '../libs/src/schema/apicurio';
import { ReducerMapper } from 'src/reduction/reducer.mapper';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '../.env'
    })
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
    },
    {
      provide: JSON_SCHEMA_PORT,
      useClass: JsonSchemaAdapter
    },
    {
      provide: SCHEMA_REGISTRY_PORT,
      useClass: SchemaRegistryAdapter
    },
    ReducerMapper
  ],
})
export class AppModule {}
