import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { TransactionService } from './transaction.service';
import {
  CreateTransactionResponse,
  CreateTransactionResult,
  TransactionDto,
  CreateTransactionStatus,
} from './transaction.dto';
import { ValidationPipe } from '../../validation.pipe';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @Body(ValidationPipe) request: TransactionDto,
  ): Promise<CreateTransactionResponse> {
    const result: CreateTransactionResult =
      await this.transactionService.createTransaction(request);
    if (result.status === CreateTransactionStatus.OK) {
      return;
    }
    if (result.status === CreateTransactionStatus.PROPAGABLE_ERROR) {
      throw new BadRequestException(result.errorMessage);
    }
    throw new InternalServerErrorException();
  }
}
