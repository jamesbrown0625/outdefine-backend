import { ICompanyBalance } from "@interface";
import { getDB } from "@model";

class CompanyBalanceService {
  async getTable() {
    return (await getDB()).CompanyBalance;
  }

  async create(item: ICompanyBalance) {
    const table = await this.getTable();
    return await table.create(item);
  }

  async createOrUpdate(item: ICompanyBalance) {
    const table = await this.getTable();
    const balance = await table.findByPk(item.company_id);
    if (balance === null) {
      return await table.create(item);
    }

    await table.update(item, { where: { company_id: item.company_id } });
    return await table.findByPk(item.company_id);
  }

  async getCompanyBalance(company_id: number) {
    const table = await this.getTable();
    const balance = await table.findByPk(company_id);
    if (balance === null) {
      return await table.create({
        company_id,
        balance: 0,
      });
    }
    return balance;
  }

  async getBalance(id: number) {
    const table = await this.getTable();
    const wallet = await table.findByPk(id);
    if (wallet === null) return 0;
    return wallet.balance;
  }
}

export const companyBalanceService = new CompanyBalanceService();
