import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IsDateString, Matches } from 'class-validator';

import { TransactionService } from './transaction.service';
import {
  CreateTransactionDtoResult,
  CreateTransactionDtoResultStatus,
} from './transaction.service';
import { ValidationPipe } from '../../validation.pipe';

export class CreateTransactionRequest {
  @Matches('^([\\w\\_]+.)*[\\w\\_]+$')
  flowId: string;
  @IsDateString()
  time: Date;
  @Matches(new RegExp('^[0-9]{4}-[A-Za-z]{3}$'))
  customId: string;
}

export interface CreateTransactionResponse {
  transactionId: string;
}

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @Body(ValidationPipe) request: CreateTransactionRequest,
  ): Promise<CreateTransactionResponse> {
    const result: CreateTransactionDtoResult =
      await this.transactionService.createTransaction(request);
    if (result.status === CreateTransactionDtoResultStatus.OK) {
      return {
        transactionId: result.uuid,
      };
    }
    if (result.status === CreateTransactionDtoResultStatus.PROPAGABLE_ERROR) {
      throw new BadRequestException(result.errorMessage);
    }
    throw new InternalServerErrorException();
  }
}
