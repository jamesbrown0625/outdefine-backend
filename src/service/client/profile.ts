import { IClientProfile } from "@interface";
import { invokeLambda } from "@libs";
import { getDB } from "@model";

class ClientProfileService {
  async getTable() {
    return (await getDB()).ClientProfile;
  }

  async create(item: IClientProfile) {
    const table = await this.getTable();
    const result = await table.create(item);

    await invokeLambda("contactUpdatedEventHook", {
      body: JSON.stringify(result?.dataValues),
    });
    return result;
  }

  async update(item: IClientProfile) {
    const table = await this.getTable();

    await invokeLambda("contactUpdatedEventHook", {
      body: JSON.stringify(item),
    });

    return table.update(item, { where: { client_id: item.client_id } });
  }

  async getOneByClientId(id: number) {
    const table = await this.getTable();
    return await table.findByPk(id, {
      include: [
        {
          model: (await getDB()).User,
          as: "User",
        },
      ],
    });
  }

  async getOneByCompanyId(company_id: number) {
    const table = await this.getTable();
    return await table.findOne({
      where: {
        company_id,
      },
      includes: [
        {
          model: (await getDB()).User,
          as: "User",
        },
      ],
    });
  }

  async createOrUpdate(item: IClientProfile) {
    const profile = await this.getOneByClientId(item.client_id);
    if (profile === null) {
      await this.create(item);
    }
    await this.update(item);
  }

  async getAllTeamMembers(companyId: number) {
    const table = await this.getTable();
    const data = await table.findAll({
      include: [
        {
          model: (await getDB()).User,
          as: "User",
        },
        {
          model: (await getDB()).User,
          as: "Inviter",
        },
        {
          model: (await getDB()).Company,
          as: "Company",
        },
      ],
      where: { company_id: companyId },
    });

    return data;
  }

  async updateRecruitSlug(id: number, slug: string) {
    const table = await this.getTable();
    await table.update(
      {
        recruitcrm_slug: slug,
      },
      { where: { client_id: id } },
    );
  }

  async remove(clientId: number) {
    const table = await this.getTable();
    await table.destroy({ where: { client_id: clientId }, force: true });
  }
}

export const clientProfileService = new ClientProfileService();
