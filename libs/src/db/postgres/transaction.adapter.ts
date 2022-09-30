import { Client, DatabaseError } from 'pg';
import { Injectable } from '@nestjs/common';

import {
  CreateTransactionQuery,
  CreateTransactionQueryResult,
  TransactionPort,
  UpdateTransactionStatusQuery,
  UpdateTransactionStatusQueryResult,
  UpdateTransactionStepQuery,
  UpdateTransactionStepQueryResult,
} from '../interfaces';

@Injectable()
export class TransactionAdapter implements TransactionPort {
  private client: Client;

  constructor() {
    this.client = new Client();
    this.client.connect();
  }

  async createTransaction(
    createTransactionQuery: CreateTransactionQuery,
  ): Promise<CreateTransactionQueryResult> {
    try {
      const { time, customId } = createTransactionQuery;
      const result = await this.client.query(
        `INSERT INTO transactions (time, customId) VALUES ($1, $2) RETURNING transactionId`,
        [time, customId],
      );
      return {
        ok: true,
        uuid: result.rows[0].transactionid,
      };
    } catch (e) {
      if (e instanceof DatabaseError && e.detail) {
        return {
          ok: false,
          errorMessage: e.detail,
        };
      }
      console.error(`createTransaction - ${e}`);
      throw e;
    }
  }

  async updateTransactionStatus(
    updateTransactionStatusQuery: UpdateTransactionStatusQuery,
  ): Promise<UpdateTransactionStatusQueryResult> {
    try {
      const { id, status } = updateTransactionStatusQuery;
      await this.client.query(
        'UPDATE transactions SET status = $1 WHERE transactionid = $2',
        [status, id],
      );
      return {
        ok: true,
      };
    } catch (e) {
      console.error(`updateTransactionStatus - ${e}`);
      throw e;
    }
  }
  async updateTransactionStep(
    updateTransactionStepQuery: UpdateTransactionStepQuery,
  ): Promise<UpdateTransactionStepQueryResult> {
    try {
      const { id, step } = updateTransactionStepQuery;
      await this.client.query(
        'UPDATE transactions SET step = $1 WHERE transactionid = $2',
        [step, id],
      );
      return {
        ok: true,
      };
    } catch (e) {
      console.error(`updateTransactionStep - ${e}`);
      throw e;
    }
  }

  async close(): Promise<void> {
    await this.client.end();
  }
}
