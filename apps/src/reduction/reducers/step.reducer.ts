import { Reducer } from '../reducer.type';

export const stepReducer: Reducer = (event, transaction) => {
  return {
    ...transaction,
    step: event.step,
  };
};
