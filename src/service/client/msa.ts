import { ICompanySocialLink, IMSAAgreement } from "@interface";
import { getDB } from "@model";

class MSAAgreement {
  async getTable() {
    return (await getDB()).MSAAgreement;
  }

  async getAll() {
    const table = await this.getTable();
    const data = table.findAll();

    return data;
  }

  async getOneByVersion(version) {
    const table = await this.getTable();
    const item = await table.findOne({
      where: { msa_version: version },
    });

    return item;
  }

  async getOneByActive() {
    const table = await this.getTable();
    const items = await table.findAll({
      where: { is_active: true },
    });

    if (items.length !== 1) throw new Error("There is no active MSA agreements or more than 1");

    return items[0];
  }

  async getOneById(msaId: number) {
    const table = await this.getTable();
    return await table.findByPk(msaId);
  }

  async create(item: IMSAAgreement) {
    const table = await this.getTable();
    return await table.create(item);
  }

  async selectOneMSA(msaId: number) {
    const table = await this.getTable();
    await table.update(
      {
        is_active: false,
      },
      { where: {} },
    );
    await table.update({ is_active: true }, { where: { msa_id: msaId } });
  }

  async update(item: ICompanySocialLink) {
    const table = await this.getTable();
    const Profile = await table.findByPk(item.company_id);
    if (Profile === null) {
      return await table.create(item);
    }
    return await table.update(item, { where: { company_id: item.company_id } });
  }
}

export const msaAgreementService = new MSAAgreement();
