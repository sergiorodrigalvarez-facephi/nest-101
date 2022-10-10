import { Inject, Injectable } from '@nestjs/common';
import jsf from 'json-schema-faker'; // This import requires esModuleInterop to true in tsconfig

import {
  TransactionPort,
  TRANSACTION_PORT,
  CreateTransactionStatus as DbCreateTransactionStatus,
} from '../../../libs/src/db';
import {
  GetSchemaStatus,
  SchemaRegistryPort,
  SCHEMA_REGISTRY_PORT,
} from '../../../libs/src/schema';

export interface CreateTransactionDto {
  flowId: string;
  time: Date;
  customId: string;
}

export enum CreateTransactionDtoResultStatus {
  OK,
  PROPAGABLE_ERROR,
  NON_PROPAGABLE_ERROR,
}

export interface CreateTransactionDtoResult {
  status: CreateTransactionDtoResultStatus;
  uuid?: string;
  errorMessage?: string;
}

@Injectable()
export class TransactionService {
  constructor(
    @Inject(TRANSACTION_PORT) private transactionPort: TransactionPort,
    @Inject(SCHEMA_REGISTRY_PORT)
    private schemaRegistryPort: SchemaRegistryPort,
  ) {
    jsf.option({
      useDefaultValue: true,
      alwaysFakeOptionals: true,
    });
  }

  async createTransaction(
    transactionDto: CreateTransactionDto,
  ): Promise<CreateTransactionDtoResult> {
    const { flowId } = transactionDto;

    const getSchemaResult = await this.schemaRegistryPort.getSchema({
      schemaId: flowId,
    });

    if (getSchemaResult.status === GetSchemaStatus.NOT_FOUND) {
      console.error(
        `createTransaction - schema not found - schemaId: ${flowId}`,
      );
      return {
        status: CreateTransactionDtoResultStatus.PROPAGABLE_ERROR,
        errorMessage: `Invalid flowId: ${flowId}`,
      };
    }

    if (getSchemaResult.status === GetSchemaStatus.GENERIC_ERROR) {
      return {
        status: CreateTransactionDtoResultStatus.NON_PROPAGABLE_ERROR,
      };
    }

    const transactionSkeleton = jsf.generate(
      getSchemaResult.schemaRegistry,
    ) as object;

    const result = await this.transactionPort.createTransaction({
      flowId: transactionDto.flowId,
      customId: transactionDto.customId,
      time: transactionDto.time,
      data: transactionSkeleton,
    });

    if (result.status === DbCreateTransactionStatus.OK) {
      return {
        status: CreateTransactionDtoResultStatus.OK,
        uuid: result.uuid,
      };
    }
    if (result.status === DbCreateTransactionStatus.UNIQUE_VIOLATION) {
      return {
        status: CreateTransactionDtoResultStatus.PROPAGABLE_ERROR,
        errorMessage: result.errorMessage,
      };
    }
    return {
      status: CreateTransactionDtoResultStatus.NON_PROPAGABLE_ERROR,
    };
  }
}
