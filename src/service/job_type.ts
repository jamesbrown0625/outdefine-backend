import { getDB } from "@model";
import { IJobType, IRole } from "@interface";
import { roleService } from "@service";

class JobTypeService {
  async getTable() {
    return (await getDB()).JobType;
  }

  async getAll() {
    const table = await this.getTable();
    return table.findAll({
      include: [
        {
          model: (await getDB()).Role,
          include: [
            {
              model: (await getDB()).Skill,
            },
          ],
        },
      ],
    });
  }

  async getOneByName(name: string) {
    const table = await this.getTable();
    return await table.findOne({
      include: [
        {
          model: (await getDB()).Role,
        },
      ],
      where: { name },
    });
  }

  async create(item: IJobType) {
    const table = await this.getTable();
    return await table.create(item);
  }

  async addRoles(jobType: any, roles: any) {
    for (let i = 0; i < roles.length; i++) {
      const data: IRole = roles[i];
      const role = await roleService.create(data);
      await jobType.addRole(role.role_id);

      const skills = roles[i].skills.split(", ").map((e) => ({ name: e }));
      await roleService.addSkills(role, skills);
    }
  }

  async remove() {
    const table = await this.getTable();
    await table.destroy({ where: {}, force: true });
  }
}

export const jobTypeService = new JobTypeService();
