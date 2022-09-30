interface UpsertResult {
  ok: boolean;
  errorMessage?: string;
}

export interface CreateEventQuery {
  transactionId: string;
  time: Date;
  type: string;
  data: Record<string, unknown>;
}

export type CreateEventQueryResult = UpsertResult;

export interface GetEventBatchQuery {
  amount: number;
}

export interface GetEventBatchQueryResult {
  eventId: string;
  transactionId: string;
  time: Date;
  type: string;
  data: Record<string, unknown>;
  processed: boolean;
}

export interface UpdateProcessedEvents {
  ids: string[];
}

export type UpdateProcessedEventsResult = UpsertResult;

export interface EventPort {
  createEvent(
    createEventQuery: CreateEventQuery,
  ): Promise<CreateEventQueryResult>;

  getEventBatch(
    getEventBatch: GetEventBatchQuery,
  ): Promise<GetEventBatchQueryResult[]>;

  updateProcessedEvents(
    updateProcessedEvents: UpdateProcessedEvents,
  ): Promise<UpdateProcessedEventsResult>;

  close(): Promise<void>;
}

export const EVENT_PORT = Symbol('EVENT_PORT');
