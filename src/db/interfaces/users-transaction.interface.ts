export interface UserTransactionInterface<T> {
  id: string;
  userId: string;
  stockSymbol: string;
  data: object;
  status: T;
}
