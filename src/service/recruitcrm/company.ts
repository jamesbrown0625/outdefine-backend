import { recruitCRMService } from "./recruitcrm";

class RecruitCRMCompanyService {
  async getAllCandidates() {
    console.log("222222222");

    return await recruitCRMService.getRecruitCRMApi("candidates", {
      limit: 100,
      page: 0,
    });
  }

  async getOneByName(companyName: string) {
    const response = await recruitCRMService.getRecruitCRMApi(
      `companies/search?company_name=${companyName}`,
    );
    const companies = response.data;
    if (companies === undefined || companies === null) return null;
    return companies.length > 0 ? companies[0] : null;
  }

  async create(company) {
    return await recruitCRMService.postRecruitCRMApi(`companies`, company);
  }

  async update(slug: string, company: any) {
    return await recruitCRMService.postRecruitCRMApi(`companies/${slug}`, company);
  }

  async delete() {}
}

export const recruitCRMCompanyService = new RecruitCRMCompanyService();
