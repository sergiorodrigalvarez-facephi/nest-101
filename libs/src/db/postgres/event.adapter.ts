import { Injectable } from '@nestjs/common';
import { Client, DatabaseError } from 'pg';

import {
  Event,
  EventPort,
  CreateEventStatus,
  CreateEventQuery,
  CreateEventQueryResult,
  GetEventStatus,
  GetEventBatchQuery,
  GetEventBatchQueryResult,
  UpdateProcessedEventsStatus,
  UpdateProcessedEvents,
  UpdateProcessedEventsResult,
} from '..';

const PG_UNIQUE_VIOLATION = '23505';
const PG_FOREIGN_KEY_VIOLATION = '23503';

@Injectable()
export class EventAdapter implements EventPort {
  // TODO: Make a load test and switch to Pool if performance is poor
  private client: Client;

  constructor() {
    this.client = new Client();
    this.client.connect();
  }

  async createEvent(
    createEventQuery: CreateEventQuery,
  ): Promise<CreateEventQueryResult> {
    try {
      const { transactionId, time, type, data } = createEventQuery;
      await this.client.query(
        'INSERT INTO events (transactionid, time, type, data) VALUES ($1, $2, $3, $4)',
        [transactionId, time, type, data],
      );
      return {
        status: CreateEventStatus.OK,
      };
    } catch (e) {
      if (e instanceof DatabaseError) {
        if (e.code === PG_UNIQUE_VIOLATION) {
          return {
            status: CreateEventStatus.UNIQUE_VIOLATION,
            errorMessage: e.detail,
          };
        }
        if (e.code === PG_FOREIGN_KEY_VIOLATION) {
          return {
            status: CreateEventStatus.MISSING_TRANSACTION,
            errorMessage: e.detail,
          };
        }
      }
      console.error(`createEvent - ${e}`);
      return {
        status: CreateEventStatus.GENERIC_ERROR,
      };
    }
  }

  async getEventBatch(
    getEventBatchQuery: GetEventBatchQuery,
  ): Promise<GetEventBatchQueryResult> {
    try {
      const { amount } = getEventBatchQuery;
      const result = await this.client.query(
        'SELECT * FROM events WHERE processed = false LIMIT $1',
        [amount],
      );
      if (result.rows && result.rows.length > 0) {
        return {
          status: GetEventStatus.OK,
          events: this.getEventBatchMapper(result.rows),
        };
      }
      return {
        status: GetEventStatus.EMPTY_RESULT,
        events: [],
      };
    } catch (e) {
      console.error(`getEventBatch - ${e}`);
      return {
        status: GetEventStatus.GENERIC_ERROR,
      };
    }
  }

  private getEventBatchMapper(rows: any[]): Event[] {
    return rows.map((row) => ({
      eventId: row.eventid,
      transactionId: row.transactionid,
      time: row.time,
      type: row.type,
      data: row.data,
      processed: row.processed,
    }));
  }

  async updateProcessedEvents(
    updateProcessedEvents: UpdateProcessedEvents,
  ): Promise<UpdateProcessedEventsResult> {
    try {
      const { ids } = updateProcessedEvents;
      const result = await this.client.query(
        'UPDATE events SET processed = true WHERE eventid = ANY($1)',
        [ids],
      );
      if (result.rowCount !== ids.length) {
        return {
          status: UpdateProcessedEventsStatus.MISMATCH_UPDATE,
          errorMessage: `Ids list: ${ids}. Updated amount: ${result.rowCount}`,
        };
      }
      return {
        status: UpdateProcessedEventsStatus.OK,
      };
    } catch (e) {
      console.error(`updateProcessedEvents - ${e}`);
      return {
        status: UpdateProcessedEventsStatus.GENERIC_ERROR,
      };
    }
  }

  async close(): Promise<void> {
    await this.client.end();
  }
}
