import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  ValidationPipe,
} from '@nestjs/common';

import { CreateEventResult, EventDto, CreateEventStatus } from './producer.dto';
import { ProducerService } from './producer.service';

@Controller('event')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  async createEvent(@Body(ValidationPipe) request: EventDto) {
    const result: CreateEventResult = await this.producerService.createEvent(
      request,
    );
    if (result.status === CreateEventStatus.OK) {
      return;
    }
    if (result.status === CreateEventStatus.PROPAGABLE_ERROR) {
      throw new BadRequestException(result.errorMessage);
    }
    throw new InternalServerErrorException();
  }
}
