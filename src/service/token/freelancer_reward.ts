import { IFreelancerReward } from "@interface";
import { getDB, getSequelize } from "@model";

class FreelancerRewardService {
  async getTable() {
    return (await getDB()).FreelancerReward;
  }

  async getAll() {
    const table = await this.getTable();
    return table.findAll();
  }

  async getAllByUserId(user_id: number) {
    const table = await this.getTable();
    return table.findAll({ where: { user_id } });
  }

  async create(item: IFreelancerReward) {
    const table = await this.getTable();
    return await table.create(item);
  }

  async update(item: IFreelancerReward) {
    const table = await this.getTable();
    await table.update(item, { where: { id: item.id } });
  }

  async getAggregatedData(user_id: number, filter = "monthly") {
    const sequelize = await getSequelize();
    let query: string;
    switch (filter) {
      case "weekly":
        query = `select sum(amount), ((date_part('day', date_issued)::integer - 1) / 7) + 1 as week from freelancer_rewards where EXTRACT(YEAR FROM freelancer_rewards.date_issued)=EXTRACT(YEAR FROM CURRENT_DATE) AND EXTRACT(MONTH FROM freelancer_rewards.date_issued)=EXTRACT(MONTH FROM CURRENT_DATE) AND user_id=${user_id} group by ((date_part('day', date_issued)::integer - 1) / 7) + 1`;
        break;
      case "monthly":
        query = `select sum(amount) as amount, EXTRACT(MONTH FROM freelancer_rewards.date_issued) as month from freelancer_rewards where EXTRACT(YEAR FROM freelancer_rewards.date_issued)=EXTRACT(YEAR FROM CURRENT_DATE) AND freelancer_rewards.user_id=${user_id} group by EXTRACT(MONTH FROM freelancer_rewards.date_issued)`;
        break;
      case "semi-yearly":
        query = `SELECT sum(amount), (CASE WHEN EXTRACT(MONTH FROM freelancer_rewards.date_issued) BETWEEN 1 AND 6 THEN 1 ELSE 2 END) as semester from freelancer_rewards where user_id=${user_id} group by (CASE WHEN EXTRACT(MONTH FROM freelancer_rewards.date_issued) BETWEEN 1 AND 6 THEN 1 ELSE 2 END)`;
        break;
      case "yearly":
        query = `select sum(amount) as amount, EXTRACT(YEAR FROM date_issued) as year from freelancer_rewards where user_id=${user_id} group by EXTRACT(YEAR FROM date_issued)`;
        break;
    }
    const records = await sequelize.query(query);
    return records[0];
  }
}

export const freelancerRewardService = new FreelancerRewardService();
