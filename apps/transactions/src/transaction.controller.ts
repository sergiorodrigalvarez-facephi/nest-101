import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
//import { Request, Response } from 'express'

import { TransactionService } from './transaction.service';
import { CreateTransactionResponse, CreateTransactionResult, TransactionDto } from '../../../libs/dto/transaction.dto';
import { ValidationPipe } from './validation.pipe';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly appService: TransactionService) {}

  @Post()
  async createTransaction(@Body(ValidationPipe) request: TransactionDto): Promise<CreateTransactionResponse> {
    const result: CreateTransactionResult = await this.appService.createTransaction(request);
    if (result.ok) {
      return {
        transactionId: result.uuid,
      }
    } else {
      throw new BadRequestException(result.errorMessage)
    }
  }
}
