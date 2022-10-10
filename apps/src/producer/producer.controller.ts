import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { IsDateString, Matches, IsUUID, IsObject } from 'class-validator';

import {
  ProducerService,
  CreateEventDtoResult,
  CreateEventDtoResultStatus,
} from './producer.service';

export class CreateEventRequest {
  @IsUUID('4')
  transactionId: string;
  @IsDateString()
  time: Date;
  @Matches('^([\\w\\_]+.)*[\\w\\_]+$')
  type: string;
  @IsObject()
  data: Record<string, unknown>;
}

@Controller('event')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  async createEvent(@Body(ValidationPipe) request: CreateEventRequest) {
    const result: CreateEventDtoResult = await this.producerService.createEvent(
      request,
    );
    if (result.status === CreateEventDtoResultStatus.OK) {
      return;
    }
    if (result.status === CreateEventDtoResultStatus.PROPAGABLE_ERROR) {
      throw new BadRequestException(result.errorMessage);
    }
    throw new InternalServerErrorException();
  }
}
