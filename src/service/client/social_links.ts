import { ICompanySocialLink } from "@interface";
import { getDB } from "@model";

class CompanySocialLinkService {
  async getTable() {
    return (await getDB()).CompanySocialLink;
  }

  async update(item: ICompanySocialLink) {
    const table = await this.getTable();
    const Profile = await table.findByPk(item.company_id);
    if (Profile === null) {
      return await table.create(item);
    }
    return await table.update(item, { where: { company_id: item.company_id } });
  }

  async getOne(id: number) {
    const table = await this.getTable();
    return table.findByPk(id);
  }
}

export const companySocialLinkService = new CompanySocialLinkService();
