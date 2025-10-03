import { Injectable, Logger } from '@nestjs/common';
import { Users } from '@prisma/client';
import {
  GetUserByCriteriaInterface,
  ReturnFunctionInterface,
} from 'src/common/interfaces/common.interfaces';
import { UtilService } from 'src/common/util.service';
import { PrismaService } from './prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly util: UtilService,
  ) {}

  /**
   * Get a user by criteria
   * @param param0 - The criteria to search for the user
   * @param param1 - Additional options for the query
   * @returns The user found or an error
   */
  async getUserByCriteria(
    { id, email, rowsPerPage = 50, cursor }: GetUserByCriteriaInterface,
    { includeTransactions = false }: { includeTransactions?: boolean } = {},
  ): Promise<ReturnFunctionInterface<Users[]>> {
    const fName = `[${UsersService.name}] [${this.getUserByCriteria.name}]`;

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

    if (!this.util.isEmpty(email)) {
      logs += ` email: ${email},`;
      where.AND.push({ email });
    }

    let include = {};
    if (includeTransactions) {
      logs += ' includeTransactions: true,';
      include = { Transactions: true };
    }

    let pagParams = {};
    if (cursor) {
      pagParams = {
        skip: 1,
        cursor: { id: cursor },
      };
    }

    try {
      let count: number = 0;
      Logger.log(`${fName} Searching users with criteria: ${logs}`);

      if (this.util.isEmpty(cursor)) {
        count = await this.prisma.users.count({ where });
      }

      const data = await this.prisma.users.findMany({
        where,
        include,
        orderBy: { createdAt: 'desc' },
        take: rowsPerPage,
        ...pagParams,
      });
      return { success: true, data, count };
    } catch (err) {
      const error = 'Error fetching users';
      Logger.error(`${fName} ${error}`);
      console.error(err);
      return { success: false, error };
    }
  }
}
