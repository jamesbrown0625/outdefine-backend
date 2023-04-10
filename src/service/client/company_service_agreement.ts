import { ICompanyServiceAgreement } from "@interface";
import { getDB } from "@model";

class CompanyServiceAgreementService {
  async getTable() {
    return (await getDB()).CompanyServiceAgreement;
  }

  async update(item: ICompanyServiceAgreement) {
    const table = await this.getTable();
    const Profile = await table.findByPk(item.company_id);
    if (Profile === null) {
      return await table.create(item);
    }
    return await table.update(item, { where: { company_id: item.company_id } });
  }
}

export const companyServiceAgreementService = new CompanyServiceAgreementService();
