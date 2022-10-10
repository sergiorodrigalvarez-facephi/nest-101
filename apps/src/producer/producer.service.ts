import { Inject, Injectable } from '@nestjs/common';

import {
  EventPort,
  EVENT_PORT,
  CreateEventStatus as DbCreateEventStatus,
} from '../../../libs/src/db';
import {
  JSON_SCHEMA_PORT,
  SCHEMA_REGISTRY_PORT,
  JsonSchemaPort,
  SchemaRegistryPort,
  ValidationStatus,
  GetSchemaStatus,
} from '../../../libs/src/schema';

export class CreateEventDto {
  transactionId: string;
  time: Date;
  type: string;
  data: Record<string, unknown>;
}

export enum CreateEventDtoResultStatus {
  OK,
  PROPAGABLE_ERROR,
  NON_PROPAGABLE_ERROR,
}

export interface CreateEventDtoResult {
  status: CreateEventDtoResultStatus;
  errorMessage?: string[];
}

@Injectable()
export class ProducerService {
  constructor(
    @Inject(EVENT_PORT) private eventPort: EventPort,
    @Inject(SCHEMA_REGISTRY_PORT)
    private schemaRegistryPort: SchemaRegistryPort,
    @Inject(JSON_SCHEMA_PORT)
    private jsonSchemaPort: JsonSchemaPort,
  ) {}

  async createEvent(eventDto: CreateEventDto): Promise<CreateEventDtoResult> {
    const { type, data } = eventDto;

    const getSchemaResult = await this.schemaRegistryPort.getSchema({
      schemaId: type,
    });

    if (getSchemaResult.status === GetSchemaStatus.NOT_FOUND) {
      console.error(`createTransaction - schema not found - schemaId: ${type}`);
      return {
        status: CreateEventDtoResultStatus.PROPAGABLE_ERROR,
        errorMessage: [`Invalid type: ${type}`],
      };
    }

    if (getSchemaResult.status === GetSchemaStatus.GENERIC_ERROR) {
      return {
        status: CreateEventDtoResultStatus.NON_PROPAGABLE_ERROR,
      };
    }

    const validationResult = this.jsonSchemaPort.validate({
      data,
      schema: getSchemaResult.schemaRegistry,
    });

    if (validationResult.status === ValidationStatus.GENERIC_ERROR) {
      return {
        status: CreateEventDtoResultStatus.NON_PROPAGABLE_ERROR,
      };
    }

    if (validationResult.status === ValidationStatus.SCHEMA_ERROR) {
      console.error(`createEvent - ${validationResult.schemaError}`);
      return {
        status: CreateEventDtoResultStatus.NON_PROPAGABLE_ERROR,
      };
    }

    if (validationResult.status === ValidationStatus.VALIDATION_ERROR) {
      return {
        status: CreateEventDtoResultStatus.PROPAGABLE_ERROR,
        errorMessage: validationResult.validationErrors,
      };
    }

    const result = await this.eventPort.createEvent(eventDto);

    if (result.status === DbCreateEventStatus.OK) {
      return {
        status: CreateEventDtoResultStatus.OK,
      };
    }
    if (
      result.status === DbCreateEventStatus.MISSING_TRANSACTION ||
      result.status === DbCreateEventStatus.UNIQUE_VIOLATION
    ) {
      return {
        status: CreateEventDtoResultStatus.PROPAGABLE_ERROR,
        errorMessage: [result.errorMessage],
      };
    }
    return {
      status: CreateEventDtoResultStatus.NON_PROPAGABLE_ERROR,
    };
  }
}
