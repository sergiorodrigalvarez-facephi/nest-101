import { IsDateString, Matches } from "class-validator";
import {} from 'uuid';

export class TransactionDto {
    @IsDateString()
    time: Date;
    @Matches(new RegExp('^[0-9]{4}-[A-Za-z]{3}$'))
    customId: String;
}

export interface CreateTransactionResult {
    ok: boolean,
    uuid?: string,
    errorMessage?: string,
}

export interface CreateTransactionResponse {
    transactionId: string,
}
