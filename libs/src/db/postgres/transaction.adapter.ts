import { Client, DatabaseError } from 'pg';
import { Injectable } from '@nestjs/common';

import {
  TransactionPort,
  CreateTransactionStatus,
  CreateTransactionQuery,
  CreateTransactionQueryResult,
  UpdateTransactionStatus,
  UpdateTransactionQuery,
  UpdateTransactionQueryResult,
} from '..';
import {
  GetTransactionQuery,
  GetTransactionQueryResult,
  GetTransactionStatus,
  Transaction,
} from '../trasaction.port';

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
      const { flowId, time, customId, data } = createTransactionQuery;
      const result = await this.client.query(
        `INSERT INTO transactions (flowId, time, customId, data) VALUES ($1, $2, $3, $4) RETURNING transactionId`,
        [flowId, time, customId, data],
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

  async getTransaction(
    getTransaction: GetTransactionQuery,
  ): Promise<GetTransactionQueryResult> {
    try {
      const { id } = getTransaction;

      const result = await this.client.query(
        'SELECT * FROM transactions WHERE transactionid = $1',
        [id],
      );
      if (result.rows && result.rows.length > 0) {
        return {
          status: GetTransactionStatus.OK,
          transaction: this.getTransactionMapper(result.rows[0]),
        };
      }
      return {
        status: GetTransactionStatus.EMPTY_RESULT,
        transaction: null,
      };
    } catch (e) {
      console.error(`getTransaction - ${e}`);
      return {
        status: GetTransactionStatus.GENERIC_ERROR,
      };
    }
  }

  private getTransactionMapper(row: any): Transaction {
    return {
      customId: row.customid,
      data: row.data,
      flowId: row.flowid,
      status: row.status,
      step: row.step,
      time: row.time,
      transactionId: row.transactionid,
    };
  }

  async updateTransaction(
    updateTransactionQuery: UpdateTransactionQuery,
  ): Promise<UpdateTransactionQueryResult> {
    try {
      const { id, data, status, step } = updateTransactionQuery;

      if (data) {
        await this.client.query(
          'UPDATE transactions SET data = $1 WHERE transactionid = $2',
          [data, id],
        );
      }
      if (status) {
        await this.client.query(
          'UPDATE transactions SET status = $1 WHERE transactionid = $2',
          [status, id],
        );
      }
      if (step) {
        await this.client.query(
          'UPDATE transactions SET step = $1 WHERE transactionid = $2',
          [step, id],
        );
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

  async close(): Promise<void> {
    await this.client.end();
  }
}
