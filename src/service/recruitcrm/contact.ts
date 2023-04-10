import { recruitCRMService } from "./recruitcrm";

class RecruitCRMContactService {
  async getAllContacts() {
    return await recruitCRMService.getRecruitCRMApi("contacts", {
      limit: 100,
      page: 0,
    });
  }

  async getOneByEmail(email: string) {
    const response = await recruitCRMService.getRecruitCRMApi(`contacts/search?email=${email}`);
    const contacts = response.data;
    if (contacts === undefined || contacts === null) return null;
    return contacts.length > 0 ? contacts[0] : null;
  }

  async create(profile) {
    return await recruitCRMService.postRecruitCRMApi(`contacts`, profile);
  }

  async update(slug: string, profile: any) {
    return await recruitCRMService.postRecruitCRMApi(`contacts/${slug}`, profile);
  }

  async delete() {}
}

export const recruitCRMContactService = new RecruitCRMContactService();
