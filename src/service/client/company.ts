import { getDB } from "@model";
import { ICompanyDetail } from "@interface";
import { invokeLambda } from "@libs";

class CompanyService {
  async getTable() {
    return (await getDB()).Company;
  }

  async getAll() {
    const table = await this.getTable();
    const data = table.findAll({
      include: [
        {
          model: (await getDB()).CompanySocialLink,
          as: "CompanySocialLink",
        },
      ],
    });

    return data;
  }

  async getOneByName(name: string) {
    const table = await this.getTable();
    const company = await table.findOne({
      where: { name },
      include: [
        {
          model: (await getDB()).CompanySocialLink,
          as: "CompanySocialLink",
        },
      ],
    });

    return company;
  }

  async getOneById(id: number) {
    const table = await this.getTable();
    const company = await table.findByPk(id, {
      include: [
        {
          model: (await getDB()).CompanySocialLink,
          as: "CompanySocialLink",
        },
      ],
    });

    return company;
  }

  async create(item: ICompanyDetail) {
    const table = await this.getTable();
    const createdItem = await table.create(item);

    await invokeLambda("companyUpdatedEventHook", {
      body: JSON.stringify(createdItem.dataValues),
    });

    return createdItem;
  }

  async updateRecruitSlug(id: number, slug: string) {
    const table = await this.getTable();
    await table.update(
      {
        recruitcrm_slug: slug,
      },
      { where: { company_id: id } },
    );
  }

  async update(item: ICompanyDetail) {
    const table = await this.getTable();

    await table.update(item, { where: { company_id: item.company_id } });
    await invokeLambda("companyUpdatedEventHook", {
      body: JSON.stringify(item),
    });
  }
}

export const companyService = new CompanyService();
