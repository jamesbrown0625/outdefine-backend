import { getDB } from "@model";
import { IRole, ISkill } from "@interface";
import { skillService } from "@service";

class RoleService {
  async getTable() {
    return (await getDB()).Role;
  }

  async getAll() {
    const table = await this.getTable();
    return table.findAll({
      include: [
        {
          model: (await getDB()).Skill,
        },
      ],
    });
  }

  async getAllWithOptions(options) {
    const table = await this.getTable();
    return table.findAll(options);
  }

  async create(item: IRole) {
    const table = await this.getTable();
    return await table.create(item);
  }

  async addSkills(role: any, items: Array<ISkill>) {
    // const skills = await skillService.bulkCreate(items)
    // await role.addSkills(skills)
    for (let i = 0; i < items.length; i++) {
      const item: ISkill = items[i];
      let skill = await skillService.getOneByName(item.name);
      if (skill === null) {
        skill = await skillService.create(item);
      }
      await role.addSkill(skill.id);
    }
  }

  async getOneById(id: number) {
    const table = await this.getTable();
    return await table.findByPk(id);
  }

  async remove() {
    const table = await this.getTable();
    await table.destroy({ where: {}, force: true });
  }
}

export const roleService = new RoleService();
