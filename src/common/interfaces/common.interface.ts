export interface ReturnFunctionInterface<T> {
  success: boolean;
  data?: T;
  error?: string;
  exception?: any;
  nextToken?: string;
  count?: number;
}

export interface BaseGetByCriteriaInterface {
  id?: string;
  rowsPerPage?: number;
  cursor?: string;
}
export interface GetUserByCriteriaInterface extends BaseGetByCriteriaInterface {
  email?: string;
}
