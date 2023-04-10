import { IFreelancerSkill } from "@interface";
import { getDB } from "@model";

class FreelancerSkillService {
  async getTable() {
    return (await getDB()).FreelancerSkill;
  }

  async create(item: IFreelancerSkill) {
    const table = await this.getTable();
    return table.create(item);
  }

  async removeAll(freelancer_id: number) {
    const table = await this.getTable();
    return table.destroy({ where: { freelancerProfileFreelancerId: freelancer_id } });
  }
}

export const freelancerSkillService = new FreelancerSkillService();
