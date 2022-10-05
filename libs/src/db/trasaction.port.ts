interface CommonResult {
  errorMessage?: string;
}

export enum CreateTransactionStatus {
  OK,
  UNIQUE_VIOLATION,
  GENERIC_ERROR,
}

export enum UpdateTransactionStatus {
  OK,
  NO_UPDATE,
  GENERIC_ERROR,
}

export interface CreateTransactionQuery {
  time: Date;
  customId: string;
}

export interface CreateTransactionQueryResult extends CommonResult {
  status: CreateTransactionStatus;
  uuid?: string;
}

export interface UpdateTransactionStatusQuery {
  id: string;
  status: string;
}

export interface UpdateTransactionStatusQueryResult extends CommonResult {
  status: UpdateTransactionStatus;
}

export interface UpdateTransactionStepQuery {
  id: string;
  step: string;
}

export interface UpdateTransactionStepQueryResult extends CommonResult {
  status: UpdateTransactionStatus;
}

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
