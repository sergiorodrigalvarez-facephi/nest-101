import { IsDateString, Matches, IsUUID, IsObject } from 'class-validator';

export class EventDto {
  @IsUUID('4')
  transactionId: string;
  @IsDateString()
  time: Date;
  @Matches('^([\\w\\_]+.)*[\\w\\_]+$')
  type: string;
  @IsObject()
  data: Record<string, unknown>;
}

export interface CreateEventResult {
  ok: boolean;
  errorMessage?: string;
}
