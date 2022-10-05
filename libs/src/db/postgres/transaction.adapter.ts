import { Client, DatabaseError } from 'pg';
import { Injectable } from '@nestjs/common';

import {
  TransactionPort,
  CreateTransactionStatus,
  CreateTransactionQuery,
  CreateTransactionQueryResult,
  UpdateTransactionStatus,
  UpdateTransactionStatusQuery,
  UpdateTransactionStatusQueryResult,
  UpdateTransactionStepQuery,
  UpdateTransactionStepQueryResult,
} from '..';

const PG_UNIQUE_VIOLATION = '23505';

@Injectable()
export class TransactionAdapter implements TransactionPort {
  // TODO: Make a load test and switch to Pool if performance is poor
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
        status: CreateTransactionStatus.OK,
        uuid: result.rows[0].transactionid,
      };
    } catch (e) {
      if (e instanceof DatabaseError) {
        if (e.code === PG_UNIQUE_VIOLATION) {
          return {
            status: CreateTransactionStatus.UNIQUE_VIOLATION,
            errorMessage: e.detail,
          };
        }
      }
      console.error(`createTransaction - ${e}`);
      return {
        status: CreateTransactionStatus.GENERIC_ERROR,
      };
    }
  }

  async updateTransactionStatus(
    updateTransactionStatusQuery: UpdateTransactionStatusQuery,
  ): Promise<UpdateTransactionStatusQueryResult> {
    try {
      const { id, status } = updateTransactionStatusQuery;
      const result = await this.client.query(
        'UPDATE transactions SET status = $1 WHERE transactionid = $2',
        [status, id],
      );
      if (result.rowCount !== 1) {
        return {
          status: UpdateTransactionStatus.NO_UPDATE,
          errorMessage: `Id: ${id}. Status: ${status}`,
        };
      }
      return {
        status: UpdateTransactionStatus.OK,
      };
    } catch (e) {
      console.error(`updateTransactionStatus - ${e}`);
      return {
        status: UpdateTransactionStatus.GENERIC_ERROR,
      };
    }
  }
  async updateTransactionStep(
    updateTransactionStepQuery: UpdateTransactionStepQuery,
  ): Promise<UpdateTransactionStepQueryResult> {
    try {
      const { id, step } = updateTransactionStepQuery;
      const result = await this.client.query(
        'UPDATE transactions SET step = $1 WHERE transactionid = $2',
        [step, id],
      );
      if (result.rowCount !== 1) {
        return {
          status: UpdateTransactionStatus.NO_UPDATE,
          errorMessage: `Id: ${id}. Step: ${step}`,
        };
      }
      return {
        status: UpdateTransactionStatus.OK,
      };
    } catch (e) {
      console.error(`updateTransactionStep - ${e}`);
      return {
        status: UpdateTransactionStatus.GENERIC_ERROR,
      };
    }
  }

  async close(): Promise<void> {
    await this.client.end();
  }
}
