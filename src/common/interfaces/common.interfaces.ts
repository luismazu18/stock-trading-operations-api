export interface ReturnFunctionInterface<T> {
  success: boolean;
  data?: T;
  error?: string;
  exception?: any;
  nextToken?: string;
  count?: number;
}

export interface GetUserByCriteriaInterface {
  id?: string;
  email?: string;
  rowsPerPage?: number;
  cursor?: string;
}
