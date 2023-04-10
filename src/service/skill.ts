import { getDB } from "@model";
import { ISkill } from "@interface";

class SkillService {
  async getTable() {
    return (await getDB()).Skill;
  }

  async getAll() {
    const table = await this.getTable();
    return table.findAll();
  }

  async getOneByName(name) {
    const table = await this.getTable();
    return table.findOne({
      where: { name },
    });
  }

  async bulkCreate(items: Array<ISkill>) {
    const table = await this.getTable();
    return await table.bulkCreate(items);
  }

  async create(item: ISkill) {
    const table = await this.getTable();
    return await table.create(item);
  }

  async remove() {
    const table = await this.getTable();
    await table.destroy({ where: {}, force: true });
  }
}

export const skillService = new SkillService();
