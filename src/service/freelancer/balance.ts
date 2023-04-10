import { IFreelancerBalance } from "@interface";
import { getDB } from "@model";

class FreelanceBalanceService {
  async getTable() {
    return (await getDB()).FreelancerBalance;
  }

  async create(item: IFreelancerBalance) {
    const table = await this.getTable();
    return await table.create(item);
  }

  async createOrUpdate(item: IFreelancerBalance) {
    const table = await this.getTable();
    const balance = await table.findByPk(item.freelancer_id);
    if (balance === null) {
      return await table.create(item);
    }

    await table.update(item, { where: { freelancer_id: item.freelancer_id } });
    return await table.findByPk(item.freelancer_id);
  }

  async getFreelancerBalance(freelancer_id: number) {
    const table = await this.getTable();
    const balance = await table.findByPk(freelancer_id);
    if (balance === null) {
      return await table.create({
        freelancer_id,
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

export const freelanceBalanceService = new FreelanceBalanceService();
