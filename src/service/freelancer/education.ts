import { getDB } from "@model";
import { IFreelancerProfileEducation } from "@interface";

class FreelancerProfileEducationService {
  async getTable() {
    return (await getDB()).FreelancerProfileEducation;
  }

  async getByFreelancerId(freelancer_id: number) {
    const table = await this.getTable();
    return table.findAll({ where: { freelancer_id } });
  }

  async create(item: IFreelancerProfileEducation) {
    const table = await this.getTable();
    return table.create(item);
  }

  async update(item: IFreelancerProfileEducation) {
    const table = await this.getTable();
    return table.update(item, { where: { id: item.id } });
  }

  async removeById(id: number) {
    const table = await this.getTable();
    await table.destroy({ where: { id }, force: true });
  }

  async secureRemoveById(id: number, freelancer_id: number) {
    const table = await this.getTable();
    await table.destroy({ where: { id, freelancer_id }, force: true });
  }
}
export const freelancerProfileEducationService = new FreelancerProfileEducationService();
