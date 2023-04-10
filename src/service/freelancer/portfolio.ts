import { getDB } from "@model";
import { IFreelancerProfilePortfolio } from "@interface";

class FreelancerProfilePortfolioService {
  async getTable() {
    return (await getDB()).FreelancerProfilePortfolio;
  }

  async getByFreelancerId(freelancer_id: number) {
    const table = await this.getTable();
    return table.findAll({ where: { freelancer_id } });
  }

  async create(item: IFreelancerProfilePortfolio) {
    const table = await this.getTable();
    return table.create(item);
  }

  async update(item: IFreelancerProfilePortfolio) {
    const table = await this.getTable();
    return table.update(item, { where: { id: item.id } });
  }

  async removeById(id: number) {
    const table = await this.getTable();
    await table.destroy({ where: { id }, force: true });
  }

  async secureRemoveById(freelancer_id: number, id: number) {
    const table = await this.getTable();
    await table.destroy({ where: { id, freelancer_id }, force: true });
  }
}

export const freelancerProfilePortfolioService = new FreelancerProfilePortfolioService();
