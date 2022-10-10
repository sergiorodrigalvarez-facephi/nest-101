import { HttpStatus, Injectable } from '@nestjs/common';
import superagent from 'superagent';

import {
  SchemaRegistryPort,
  GetSchemaQuery,
  GetSchemaQueryResult,
  GetSchemaStatus,
} from '..';

@Injectable()
export class SchemaRegistryAdapter implements SchemaRegistryPort {
  private url: string;

  constructor() {
    this.url = process.env.SCHEMA_REGISTRY_URL;
    if (!this.url.endsWith('/')) {
      this.url = `${this.url}/`;
    }
  }

  async getSchema(
    getSchemaQuery: GetSchemaQuery,
  ): Promise<GetSchemaQueryResult> {
    try {
      const fullUrl = new URL(getSchemaQuery.schemaId, this.url);

      const result = await superagent(fullUrl.href);

      if (result.statusCode === HttpStatus.OK) {
        return {
          status: GetSchemaStatus.OK,
          schemaRegistry: result.body,
        };
      }
    } catch (e) {
      if (e.status === HttpStatus.NOT_FOUND) {
        return {
          status: GetSchemaStatus.NOT_FOUND,
        };
      }
      console.error(`getSchema - ${e.stack}`);
      return {
        status: GetSchemaStatus.GENERIC_ERROR,
      };
    }
  }
}
