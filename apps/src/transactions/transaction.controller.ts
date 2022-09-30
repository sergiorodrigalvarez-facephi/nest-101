import { Controller, Post, Body, BadRequestException } from '@nestjs/common';

import { TransactionService } from './transaction.service';
import {
  CreateTransactionResponse,
  CreateTransactionResult,
  TransactionDto,
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
    if (result.ok) {
      return {
        transactionId: result.uuid,
      };
    } else {
      throw new BadRequestException(result.errorMessage);
    }
  }
}
