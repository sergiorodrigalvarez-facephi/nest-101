import { Injectable } from '@nestjs/common';
import { Client, DatabaseError } from 'pg';

import {
  EventPort,
  CreateEventQuery,
  CreateEventQueryResult,
  GetEventBatchQuery,
  GetEventBatchQueryResult,
  UpdateProcessedEvents,
  UpdateProcessedEventsResult,
} from '../interfaces';

@Injectable()
export class EventAdapter implements EventPort {
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
        ok: true,
      };
    } catch (e) {
      if (e instanceof DatabaseError && e.detail) {
        return {
          ok: false,
          errorMessage: e.detail,
        };
      }
      console.error(`create event - ${e}`);
      throw e;
    }
  }

  async getEventBatch(
    getEventBatchQuery: GetEventBatchQuery,
  ): Promise<GetEventBatchQueryResult[]> {
    try {
      const { amount } = getEventBatchQuery;
      const result = await this.client.query(
        'SELECT * FROM events WHERE processed = false LIMIT $1',
        [amount],
      );
      return this.getEventBatchMapper(result.rows);
    } catch (e) {
      console.error(`getEventBatch - ${e}`);
      throw e;
    }
  }

  private getEventBatchMapper(rows: any[]): GetEventBatchQueryResult[] {
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
      await this.client.query(
        'UPDATE events SET processed = true WHERE eventid = ANY($1)',
        [ids],
      );
      // TODO: What happen is result.rowCount !== ids.length?
      return {
        ok: true,
      };
    } catch (e) {
      console.error(`updateProcessedEvents - ${e}`);
      throw e;
    }
  }

  async close(): Promise<void> {
    await this.client.end();
  }
}
