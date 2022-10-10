import { Injectable, Inject } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

import {
  EventPort,
  EVENT_PORT,
  GetEventStatus,
  GetTransactionStatus,
  TransactionPort,
  TRANSACTION_PORT,
} from '../../../libs/src/db';
import { GetReducerStatus, ReducerMapper } from 'src/reduction/reducer.mapper';

@Injectable()
export class ConsumerService {
  static readonly DEFAULT_CONSUMER_INTERVAL_MS = 5000;
  static readonly DEFAULT_BATCH_SIZE = 10;

  readonly batch_size =
    this.config.get('BATCH_SIZE') || ConsumerService.DEFAULT_BATCH_SIZE;

  constructor(
    private scheduler: SchedulerRegistry,
    private config: ConfigService,
    private reducerMapper: ReducerMapper,
    @Inject(EVENT_PORT) private eventPort: EventPort,
    @Inject(TRANSACTION_PORT) private transactionPort: TransactionPort,
  ) {
    /* When fetchEventBatch method is executed, scope is not longer "this" ConsumerService instance, 
        so we have to "bind" the fetchEventBatch method with "this" scope */
    const interval = setInterval(
      this.fetchEventBatch.bind(this),
      this.config.get('CONSUMER_INTERVAL_MS') ||
        ConsumerService.DEFAULT_CONSUMER_INTERVAL_MS,
    );
    this.scheduler.addInterval('consumer', interval);
  }

  private async fetchEventBatch() {
    const eventBatch = await this.eventPort.getEventBatch({
      amount: this.batch_size,
    });

    if (eventBatch.status === GetEventStatus.GENERIC_ERROR) {
      console.error(`There was an error fetching events`);
      return;
    }

    const events = eventBatch.events;

    console.log(`${events.length} event/s fetched`);

    const uniqueTransactionIds: string[] = events.reduce((acc, cur) => {
      if (!acc.includes(cur.transactionId)) {
        acc.push(cur.transactionId);
      }
      return acc;
    }, []);

    for (const transactionId of uniqueTransactionIds) {
      const getTransactionResult = await this.transactionPort.getTransaction({
        id: transactionId,
      });

      if (getTransactionResult.status === GetTransactionStatus.EMPTY_RESULT) {
        console.error(`Transaction not found. Id: ${transactionId}`);
        continue;
      }

      if (getTransactionResult.status === GetTransactionStatus.GENERIC_ERROR) {
        continue;
      }

      const transactionEvents = events.filter(
        (event) => event.transactionId === transactionId,
      );

      const transaction = getTransactionResult.transaction;
      let transactionData = transaction.data;

      for (const transactionEvent of transactionEvents) {
        const getReducerQueryResult = this.reducerMapper.getReducer({
          id: transactionEvent.type,
        });

        if (getReducerQueryResult.status === GetReducerStatus.NOT_FOUND) {
          console.error(`reducer not found. Id: ${transactionEvent.type}`);
          continue;
        }

        if (getReducerQueryResult.status === GetReducerStatus.GENERIC_ERROR) {
          continue;
        }

        const reducer = getReducerQueryResult.reducer;

        const eventData = transactionEvent.data;
        transactionData = reducer(eventData, transactionData);
      }

      this.transactionPort.updateTransaction({
        id: transaction.transactionId,
        data: transactionData,
      });

      await this.eventPort.updateProcessedEvents({
        ids: transactionEvents.map((event) => event.eventId),
      });
    }
  }
}
