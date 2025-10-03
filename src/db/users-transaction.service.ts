import { Injectable, Logger } from '@nestjs/common';
import { TransactionStatus, UserTransaction } from '@prisma/client';
import {
  BaseGetByCriteriaInterface,
  ReturnFunctionInterface,
} from 'src/common/interfaces/common.interface';
import { UtilService } from 'src/common/util.service';
import { UserTransactionInterface } from './interfaces/users-transaction.interface';
import { PrismaService } from './prisma.service';

@Injectable()
export class UsersTransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly util: UtilService,
  ) {}

  /**
   * Get user transactions by criteria
   * @param param0 - The criteria to search for user transactions
   * @returns The user transactions found or an error
   */
  async getUserTransactionByCriteria({
    id,
    rowsPerPage = 50,
    cursor,
  }: BaseGetByCriteriaInterface): Promise<
    ReturnFunctionInterface<UserTransaction[]>
  > {
    const fName = `[${UsersTransactionService.name}] [${this.getUserTransactionByCriteria.name}]`;

    const where: { AND: Array<any> } = { AND: [] };
    let logs = '';

    if (!this.util.isEmpty(id)) {
      if (!this.util.isRowId(id)) {
        const error = 'Invalid id format';
        Logger.error(`${fName} ${error}`);
        return { success: false, error };
      }

      logs += ` id: ${id},`;
      where.AND.push({ id });
    }

    let pagParams = {};
    if (cursor) {
      pagParams = {
        skip: 1,
        cursor: { id: cursor },
      };
    }

    try {
      Logger.log(`${fName} Fetching user transactions by criteria: ${logs}`);

      let count: number = 0;
      if (this.util.isEmpty(cursor)) {
        count = await this.prisma.userTransaction.count({ where });
      }

      const data = await this.prisma.userTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: rowsPerPage,
        ...pagParams,
      });
      return { success: true, data, count };
    } catch (err) {
      const error = 'Error fetching user transactions';
      Logger.error(`${fName} ${error}`);
      console.error(err);
      return { success: false, error };
    }
  }

  /**
   * Create a user transaction
   * @param param0 - The data to create a user transaction
   * @returns User transaction created or an error
   */
  async createUserTransaction({
    userId,
    stockSymbol,
    data,
    status,
  }: UserTransactionInterface<TransactionStatus>): Promise<
    ReturnFunctionInterface<UserTransaction>
  > {
    const fName = `[${UsersTransactionService.name}] [${this.createUserTransaction.name}]`;
    if (!this.util.isRowId(userId)) {
      const error = 'Invalid userId format';
      Logger.error(`${fName} ${error}`);
      return { success: false, error };
    }

    if (this.util.isEmpty(stockSymbol)) {
      const error = 'Invalid stockSymbol format';
      Logger.error(`${fName} ${error}`);
      return { success: false, error };
    }

    if (this.util.isEmpty(data)) {
      const error = 'Invalid data format';
      Logger.error(`${fName} ${error}`);
      return { success: false, error };
    }

    if (
      this.util.isEmpty(status) &&
      !Object.values(TransactionStatus).includes(status)
    ) {
      const error = 'Invalid status format';
      Logger.error(`${fName} ${error}`);
      return { success: false, error };
    }

    try {
      Logger.log(`${fName} Creating user transaction`);
      const transaction = await this.prisma.userTransaction.create({
        data: {
          userId,
          stockSymbol,
          data,
          status,
        },
      });
      return { success: true, data: transaction };
    } catch (err) {
      const error = 'Error creating user transaction';
      Logger.error(`${fName} ${error}`);
      console.error(err);
      return { success: false, error };
    }
  }
}
