import { Injectable, Inject } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

import {
  EventPort,
  EVENT_PORT,
  TransactionPort,
  TRANSACTION_PORT,
} from '../../../libs/src/db/interfaces';

@Injectable()
export class ConsumerService {
  static readonly DEFAULT_CONSUMER_INTERVAL_MS = 5000;
  static readonly DEFAULT_BATCH_SIZE = 10;

  readonly batch_size =
    this.config.get('BATCH_SIZE') || ConsumerService.DEFAULT_BATCH_SIZE;

  constructor(
    private scheduler: SchedulerRegistry,
    private config: ConfigService,
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
    const events = await this.eventPort.getEventBatch({
      amount: this.batch_size,
    });

    console.log(`${events.length} event/s fetched`);

    const uniqueTransactionIds: string[] = events.reduce((acc, cur) => {
      if (!acc.includes(cur.transactionId)) {
        acc.push(cur.transactionId);
      }
      return acc;
    }, []);

    for (const transactionId of uniqueTransactionIds) {
      const transactionEvents = events.filter(
        (event) => event.transactionId === transactionId,
      );
      //.sort((a, b) => a.time.getTime()-b.time.getTime());
      for (const transactionEvent of transactionEvents) {
        const { status, step } = transactionEvent.data as any;

        if (status) {
          await this.transactionPort.updateTransactionStatus({
            id: transactionId,
            status,
          });
        }
        if (step) {
          await this.transactionPort.updateTransactionStep({
            id: transactionId,
            step,
          });
        }
      }
      await this.eventPort.updateProcessedEvents({
        ids: transactionEvents.map((event) => event.eventId),
      });
    }
  }
}
