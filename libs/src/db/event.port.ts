interface CommonResult {
  errorMessage?: string;
}

export enum CreateEventStatus {
  OK,
  UNIQUE_VIOLATION,
  MISSING_TRANSACTION,
  GENERIC_ERROR,
}

export enum GetEventStatus {
  OK,
  EMPTY_RESULT,
  GENERIC_ERROR,
}

export enum UpdateProcessedEventsStatus {
  OK,
  MISMATCH_UPDATE,
  GENERIC_ERROR,
}

export interface Event {
  eventId: string;
  transactionId: string;
  time: Date;
  type: string;
  data: Record<string, unknown>;
  processed: boolean;
}

export interface CreateEventQuery {
  transactionId: string;
  time: Date;
  type: string;
  data: Record<string, unknown>;
}

export interface CreateEventQueryResult extends CommonResult {
  status: CreateEventStatus;
}

export interface GetEventBatchQuery {
  amount: number;
}

export interface GetEventBatchQueryResult extends CommonResult {
  status: GetEventStatus;
  events?: Event[];
}

export interface UpdateProcessedEvents {
  ids: string[];
}

export interface UpdateProcessedEventsResult extends CommonResult {
  status: UpdateProcessedEventsStatus;
}

export interface EventPort {
  createEvent(
    createEventQuery: CreateEventQuery,
  ): Promise<CreateEventQueryResult>;

  getEventBatch(
    getEventBatch: GetEventBatchQuery,
  ): Promise<GetEventBatchQueryResult>;

  updateProcessedEvents(
    updateProcessedEvents: UpdateProcessedEvents,
  ): Promise<UpdateProcessedEventsResult>;

  close(): Promise<void>;
}

export const EVENT_PORT = Symbol('EVENT_PORT');
