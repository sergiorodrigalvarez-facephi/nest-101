import { Inject, Injectable } from '@nestjs/common';

import {
  EventPort,
  EVENT_PORT,
  CreateEventStatus as DbCreateEventStatus,
} from '../../../libs/src/db';
import {
  CreateEventResult,
  EventDto,
  CreateEventStatus as ServiceCreateEventStatus,
} from './producer.dto';

@Injectable()
export class ProducerService {
  constructor(@Inject(EVENT_PORT) private eventPort: EventPort) {}

  async createEvent(eventDto: EventDto): Promise<CreateEventResult> {
    const result = await this.eventPort.createEvent(eventDto);
    if (result.status === DbCreateEventStatus.OK) {
      return {
        status: ServiceCreateEventStatus.OK,
      };
    }
    if (
      result.status === DbCreateEventStatus.MISSING_TRANSACTION ||
      result.status === DbCreateEventStatus.UNIQUE_VIOLATION
    ) {
      return {
        status: ServiceCreateEventStatus.PROPAGABLE_ERROR,
        errorMessage: result.errorMessage,
      };
    }
    return {
      status: ServiceCreateEventStatus.NON_PROPAGABLE_ERROR,
    };
  }
}
