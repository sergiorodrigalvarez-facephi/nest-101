import {
  BadRequestException,
  Body,
  Controller,
  Post,
  ValidationPipe,
} from '@nestjs/common';

import { CreateEventResult, EventDto } from './producer.dto';
import { ProducerService } from './producer.service';

@Controller('event')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  async createEvent(@Body(ValidationPipe) request: EventDto) {
    const result: CreateEventResult = await this.producerService.createEvent(
      request,
    );
    if (result.ok) {
      return;
    } else {
      throw new BadRequestException(result.errorMessage);
    }
  }
}
