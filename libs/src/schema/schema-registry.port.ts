export enum GetSchemaStatus {
  OK,
  NOT_FOUND,
  GENERIC_ERROR,
}

export interface GetSchemaQuery {
  schemaId: string;
}

export interface GetSchemaQueryResult {
  status: GetSchemaStatus;
  schemaRegistry?: Record<string, unknown>;
}

export interface SchemaRegistryPort {
  getSchema(getSchemaQuery: GetSchemaQuery): Promise<GetSchemaQueryResult>;
}

export const SCHEMA_REGISTRY_PORT = Symbol('SCHEMA_REGISTRY_PORT');
