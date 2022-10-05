import { IsDateString, Matches } from 'class-validator';

export class TransactionDto {
  @IsDateString()
  time: Date;
  @Matches(new RegExp('^[0-9]{4}-[A-Za-z]{3}$'))
  customId: string;
}

export enum CreateTransactionStatus {
  OK,
  PROPAGABLE_ERROR,
  NON_PROPAGABLE_ERROR,
}

export interface CreateTransactionResult {
  status: CreateTransactionStatus;
  uuid?: string;
  errorMessage?: string;
}

export interface CreateTransactionResponse {
  transactionId: string;
}
