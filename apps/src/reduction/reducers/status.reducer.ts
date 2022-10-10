import { Reducer } from '../reducer.type';

export const statusReducer: Reducer = (event, transaction) => {
  return {
    ...transaction,
    status: event.status,
  };
};
