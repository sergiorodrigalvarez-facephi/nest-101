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
      // TODO: Mejorar la devolución de errores de AJV en caso de enumeración; los valores permitidos se ponen en una propiedad a parte.
      /*
      [
        {
          instancePath: '/step',
          schemaPath: '#/properties/step/enum',
          keyword: 'enum',
          params: { allowedValues: [ 'widget1', 'widget2', 'widget3' ] },
          message: 'must be equal to one of the allowed values'
        }
      ]
      */
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
      console.error(`validate - ${e.stack}`);
      return {
        status: ValidationStatus.GENERIC_ERROR,
      };
    }
  }
}
