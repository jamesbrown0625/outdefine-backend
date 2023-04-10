import { getDB } from "@model";
import { IFreelancerProfileExperience } from "@interface";

class FreelancerProfileExperienceService {
  async getTable() {
    return (await getDB()).FreelancerProfileExperience;
  }

  async getByFreelancerId(freelancer_id: number) {
    const table = await this.getTable();
    return table.findAll({ where: { freelancer_id } });
  }

  async create(item: IFreelancerProfileExperience) {
    const table = await this.getTable();
    return table.create(item);
  }

  async update(item: IFreelancerProfileExperience) {
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

export const freelancerProfileExperienceService = new FreelancerProfileExperienceService();
