export type Reducer = (
  event: Record<string, unknown>,
  transaction: Record<string, unknown>,
) => Record<string, unknown>;
