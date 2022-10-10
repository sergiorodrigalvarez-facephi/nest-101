import { Injectable } from '@nestjs/common';
import { Reducer } from './reducer.type';
import { statusReducer, stepReducer } from './reducers';

export enum GetReducerStatus {
  OK,
  NOT_FOUND,
  GENERIC_ERROR,
}

export interface GetReducerQuery {
  id: string;
}

export interface GetReducerQueryResult {
  status: GetReducerStatus;
  reducer?: Reducer;
}

@Injectable()
export class ReducerMapper {
  private map = new Map<string, Reducer>();

  constructor() {
    this.map.set('transaction1Event1', stepReducer);
    this.map.set('transaction1Event2', statusReducer);
    this.map.set('transaction2Event1', stepReducer);
    this.map.set('transaction2Event2', statusReducer);
  }

  public getReducer(getReducerQuery: GetReducerQuery): GetReducerQueryResult {
    try {
      const reducer = this.map.get(getReducerQuery.id);
      if (reducer) {
        return {
          status: GetReducerStatus.OK,
          reducer,
        };
      }
      return {
        status: GetReducerStatus.NOT_FOUND,
      };
    } catch (e) {
      console.error(`getReducer - ${e.stack}`);
      return {
        status: GetReducerStatus.GENERIC_ERROR,
      };
    }
  }
}
