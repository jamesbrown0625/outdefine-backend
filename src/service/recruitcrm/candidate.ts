import { recruitCRMService } from "./recruitcrm";

class RecruitCRMCandidateService {
  async getAllCandidates() {
    return await recruitCRMService.getRecruitCRMApi("candidates", {
      limit: 100,
      page: 0,
    });
  }

  async getOneByEmail(email: string) {
    const response = await recruitCRMService.getRecruitCRMApi(`candidates/search?email=${email}`);
    const candidates = response.data;
    if (candidates === undefined || candidates === null) return null;
    return candidates.length > 0 ? candidates[0] : null;
  }

  async create(profile) {
    return await recruitCRMService.postRecruitCRMApi(`candidates`, profile);
  }

  async update(slug: string, profile: any) {
    return await recruitCRMService.postRecruitCRMApi(`candidates/${slug}`, profile);
  }

  async delete() {}
}

export const recruitCRMCandidateService = new RecruitCRMCandidateService();
