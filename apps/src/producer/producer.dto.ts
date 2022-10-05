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

export enum CreateEventStatus {
  OK,
  PROPAGABLE_ERROR,
  NON_PROPAGABLE_ERROR,
}

export interface CreateEventResult {
  status: CreateEventStatus;
  errorMessage?: string;
}
