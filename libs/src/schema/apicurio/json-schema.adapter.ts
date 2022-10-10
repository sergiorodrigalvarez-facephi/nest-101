import { Injectable } from '@nestjs/common';
import Ajv from 'ajv/dist/2020';

import {
  JsonSchemaPort,
  ValidationQuery,
  ValidationQueryResult,
  ValidationStatus,
} from '..';

@Injectable()
export class JsonSchemaAdapter implements JsonSchemaPort {
  private ajv: Ajv;

  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
    });
  }

  validate(validationQuery: ValidationQuery): ValidationQueryResult {
    try {
      const validate = this.ajv.compile(validationQuery.schema);
      const valid = validate(validationQuery.data);
      if (valid) {
        return {
          status: ValidationStatus.OK,
        };
      }
      return {
        status: ValidationStatus.VALIDATION_ERROR,
        validationErrors: validate.errors.map((error) => error.message),
      };
    } catch (e) {
      if (e.message || (e.message as string).includes('strict mode')) {
        return {
          status: ValidationStatus.SCHEMA_ERROR,
          schemaError: e.message,
        };
      }
      console.error(`validate - ${e}`);
      return {
        status: ValidationStatus.GENERIC_ERROR,
      };
    }
  }
}
