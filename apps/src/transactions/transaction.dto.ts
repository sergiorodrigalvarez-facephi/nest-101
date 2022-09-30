import { IsDateString, Matches } from 'class-validator';

export class TransactionDto {
  @IsDateString()
  time: Date;
  @Matches(new RegExp('^[0-9]{4}-[A-Za-z]{3}$'))
  customId: string;
}

export interface CreateTransactionResult {
  ok: boolean;
  uuid?: string;
  errorMessage?: string;
}

export interface CreateTransactionResponse {
  transactionId: string;
}
