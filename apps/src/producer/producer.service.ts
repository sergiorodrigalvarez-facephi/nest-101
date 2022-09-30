import { Inject, Injectable } from '@nestjs/common';

import { EventPort, EVENT_PORT } from '../../../libs/src/db/interfaces';
import { CreateEventResult, EventDto } from './producer.dto';

@Injectable()
export class ProducerService {
  constructor(@Inject(EVENT_PORT) private eventPort: EventPort) {}

  createEvent(eventDto: EventDto): Promise<CreateEventResult> {
    return this.eventPort.createEvent(eventDto);
  }
}
