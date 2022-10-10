interface CommonResult {
  errorMessage?: string;
}

export enum CreateTransactionStatus {
  OK,
  UNIQUE_VIOLATION,
  GENERIC_ERROR,
}

export enum GetTransactionStatus {
  OK,
  EMPTY_RESULT,
  GENERIC_ERROR,
}

export enum UpdateTransactionStatus {
  OK,
  GENERIC_ERROR,
}

export interface Transaction {
  transactionId: string;
  time: Date;
  customId: string;
  flowId: string;
  data: object;
  status: string;
  step: string;
}

export interface CreateTransactionQuery {
  time: Date;
  customId: string;
  flowId: string;
  data: object;
}

export interface CreateTransactionQueryResult extends CommonResult {
  status: CreateTransactionStatus;
  uuid?: string;
}

export interface GetTransactionQuery {
  id: string;
}

export interface GetTransactionQueryResult {
  status: GetTransactionStatus;
  transaction?: Transaction;
}

export interface UpdateTransactionQuery {
  id: string;
  data?: object;
  status?: string;
  step?: string;
}

export interface UpdateTransactionQueryResult extends CommonResult {
  status: UpdateTransactionStatus;
}

export interface TransactionPort {
  createTransaction(
    createTransactionQuery: CreateTransactionQuery,
  ): Promise<CreateTransactionQueryResult>;

  getTransaction(
    getTransaction: GetTransactionQuery,
  ): Promise<GetTransactionQueryResult>;

  updateTransaction(
    updateTransactionQuery: UpdateTransactionQuery,
  ): Promise<UpdateTransactionQueryResult>;

  close(): Promise<void>;
}

export const TRANSACTION_PORT = Symbol('TRANSACTION_PORT');
