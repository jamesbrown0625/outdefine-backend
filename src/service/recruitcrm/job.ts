import { RECRUITCRM_HIRING_STAGES } from "@config";
import { recruitCRMService } from "./recruitcrm";

class RecruitCRMJobService {
  async getOneByName(companyName: string, name: string) {
    const response = await recruitCRMService.getRecruitCRMApi(
      `jobs/search?company_name=${companyName}&name=${name}`,
    );
    const jobs = response.data;
    if (jobs === undefined || jobs === null) return null;
    return jobs.length > 0 ? jobs[0] : null;
  }

  async create(company) {
    return await recruitCRMService.postRecruitCRMApi(`jobs`, company);
  }

  async update(slug: string, company: any) {
    return await recruitCRMService.postRecruitCRMApi(`jobs/${slug}`, company);
  }

  async assignCandidate(candidate_slug: string, job_slug: string) {
    return await recruitCRMService.postRecruitCRMApi(`candidates/${candidate_slug}/assign`, {
      job_slug,
    });
  }

  async rejectCandidate(candidate_slug: string, job_slug: string) {
    return await recruitCRMService.postRecruitCRMApi(
      `candidates/${candidate_slug}/hiring-stages/${job_slug}`,
      {
        status_id: RECRUITCRM_HIRING_STAGES.Rejected.status_id,
      },
    );
  }

  async interviewCandidate(candidate_slug: string, job_slug: string) {
    return await recruitCRMService.postRecruitCRMApi(
      `candidates/${candidate_slug}/hiring-stages/${job_slug}`,
      {
        status_id: RECRUITCRM_HIRING_STAGES.InterviewScheduled.status_id,
      },
    );
  }

  async submitCandidate(candidate_slug: string, job_slug: string) {
    return await recruitCRMService.postRecruitCRMApi(
      `candidates/${candidate_slug}/hiring-stages/${job_slug}`,
      {
        status_id: RECRUITCRM_HIRING_STAGES.Submitted.status_id,
      },
    );
  }
}

export const recruitCRMJobService = new RecruitCRMJobService();
