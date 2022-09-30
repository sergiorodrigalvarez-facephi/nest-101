interface UpsertResult {
  ok: boolean;
  errorMessage?: string;
}

export interface CreateTransactionQuery {
  time: Date;
  customId: string;
}

export interface CreateTransactionQueryResult extends UpsertResult {
  uuid?: string;
}

export interface UpdateTransactionStatusQuery {
  id: string;
  status: string;
}

export type UpdateTransactionStatusQueryResult = UpsertResult;

export interface UpdateTransactionStepQuery {
  id: string;
  step: string;
}

export type UpdateTransactionStepQueryResult = UpsertResult;

export interface TransactionPort {
  createTransaction(
    createTransactionQuery: CreateTransactionQuery,
  ): Promise<CreateTransactionQueryResult>;

  updateTransactionStatus(
    updateTransactionStatusQuery: UpdateTransactionStatusQuery,
  ): Promise<UpdateTransactionStatusQueryResult>;

  updateTransactionStep(
    updateTransactionStepQuery: UpdateTransactionStepQuery,
  ): Promise<UpdateTransactionStepQueryResult>;

  close(): Promise<void>;
}

export const TRANSACTION_PORT = Symbol('TRANSACTION_PORT');
