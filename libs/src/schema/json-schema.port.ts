export enum ValidationStatus {
  OK,
  VALIDATION_ERROR,
  SCHEMA_ERROR,
  GENERIC_ERROR,
}

export interface ValidationQuery {
  schema: object;
  data: unknown;
}

export interface ValidationQueryResult {
  status: ValidationStatus;
  validationErrors?: string[];
  schemaError?: string;
}

export interface JsonSchemaPort {
  validate(validationQuery: ValidationQuery): ValidationQueryResult;
}

export const JSON_SCHEMA_PORT = Symbol('JSON_SCHEMA_PORT');
