import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  /**
   * Check if a string is a valid row id (uuid v4)
   */
  isRowId = (id: any): boolean => {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    return regex.test(id);
  };

  /**
   * Check if an object is empty
   */
  isEmptyObject = (obj: object): boolean => {
    return Object.keys(obj).length === 0 ? true : false;
  };

  /**
   * Check if an array is empty
   */
  isEmptyArray = (arr: string[] | object[] | number[]): boolean => {
    return arr.length === 0 ? true : false;
  };

  /**
   * Check if a string is empty
   */
  isEmptyString = (str: string): boolean => {
    return str.trim().length === 0 ? true : false;
  };

  isEmpty = (value: any): boolean => {
    if (typeof value === 'string') {
      return this.isEmptyString(value);
    }
    if (Array.isArray(value)) {
      return this.isEmptyArray(value);
    }
    if (typeof value === 'object' && value !== null) {
      return this.isEmptyObject(value);
    }
    if (typeof value === 'number' && isNaN(value)) {
      return true;
    }

    return value === null || value === undefined;
  };
}
