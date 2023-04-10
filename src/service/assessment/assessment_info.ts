import { ENUM_ASSESSMENT_STATUS, ENUM_HACKEREARTH_TEST } from "@config";
import { ICandidateAssessmentInfo } from "@interface";
import { getDB } from "@model";
import { freelancerProfileService } from "../freelancer";

class CandidateAssessmentInfoService {
  async getTable() {
    return (await getDB()).CandidateAssessmentInfo;
  }

  async getAll() {
    const table = await this.getTable();
    return table.findAll();
  }

  async getOrCreateNonEngineeringRow(emailId: string) {
    const table = await this.getTable();

    let assessmentInfo = await table.findOne({
      where: { email: emailId },
    });

    if (assessmentInfo === null) {
      await table.create({
        email: emailId,
      });
      assessmentInfo = await table.findOne({
        where: { email: emailId },
      });
    }

    return assessmentInfo;
  }

  async getOneByEmail(emailId: string) {
    const table = await this.getTable();
    const assessmentInfo = await table.findAll({
      where: { email: emailId },
    });

    return assessmentInfo;
  }

  async getOneByEmailId(emailId: string) {
    const table = await this.getTable();
    const assessmentInfo = await table.findOne({
      where: { email: emailId },
    });

    return assessmentInfo;
  }

  async createOrGetOneByEmail(emailId: string) {
    const table = await this.getTable();
    let assessmentInfo = await table.findOne({
      where: { email: emailId },
    });

    if (assessmentInfo === null) {
      await table.create({
        email: emailId,
      });
      assessmentInfo = await table.findOne({
        where: { email: emailId },
      });
    }

    return assessmentInfo;
  }

  getHackerearthReportType(item: ICandidateAssessmentInfo, testId: number) {
    if (item.confirmed_id === testId) {
      return ENUM_HACKEREARTH_TEST[0];
    }

    if (item.coding_test_id === testId) {
      return ENUM_HACKEREARTH_TEST[1];
    }

    return "NONE";
  }

  async updateOneByEmail(item: ICandidateAssessmentInfo) {
    const table = await this.getTable();
    const profile = await table.findOne({
      where: { email: item.email },
    });
    if (profile === null) {
      throw new Error("Candidate Assessment Info does not exist");
    }
    return await table.update(item, { where: { email: item.email } });
  }

  async update(item: ICandidateAssessmentInfo) {
    const table = await this.getTable();
    const Profile = await table.findOne({
      where: { id: item.id },
    });

    if (Profile === null) {
      throw new Error("Candidate Assessment Info does not exist");
    }
    return await table.update(item, { where: { id: item.id } });
  }

  async initAssessmentTakenCount(assessmentInfo: ICandidateAssessmentInfo, type: string) {
    if (type === ENUM_HACKEREARTH_TEST[0]) {
      assessmentInfo.mcq_taken_count = 0;
    } else if (type === ENUM_HACKEREARTH_TEST[1]) {
      assessmentInfo.coding_taken_count = 0;
    }
    await this.update(assessmentInfo);
  }

  async addAssessmentTakenCount(assessmentInfo: ICandidateAssessmentInfo, type: string) {
    if (type === ENUM_HACKEREARTH_TEST[0]) {
      await this.update({
        ...assessmentInfo,
        mcq_taken_count: assessmentInfo.mcq_taken_count + 1,
      });
    } else if (type === ENUM_HACKEREARTH_TEST[1]) {
      await this.update({
        ...assessmentInfo,
        coding_taken_count: assessmentInfo.coding_taken_count + 1,
      });
    }
  }

  async markAsPassed(item: ICandidateAssessmentInfo, type: string) {
    if (type === ENUM_HACKEREARTH_TEST[0]) {
      await this.update({
        ...item,
        mcq_passed: true,
      });
    } else if (type === ENUM_HACKEREARTH_TEST[1]) {
      await this.update({
        ...item,
        coding_passed: true,
      });
    }
  }

  async markAsIntroductionFailed(item: ICandidateAssessmentInfo) {
    await this.update({
      ...item,
      introduction_status: ENUM_ASSESSMENT_STATUS[3],
    });
  }

  async markAsIntroductionPassed(item: ICandidateAssessmentInfo) {
    await this.update({
      ...item,
      introduction_status: ENUM_ASSESSMENT_STATUS[2],
    });
  }

  async markAsInterviewFailed(item: ICandidateAssessmentInfo) {
    await this.update({
      ...item,
      interview_status: ENUM_ASSESSMENT_STATUS[3],
    });
    freelancerProfileService.updateTrustedStatus(item.email, "FAILED");
  }

  async markAsInterviewScheduled(item: ICandidateAssessmentInfo) {
    await this.update({
      ...item,
      interview_status: ENUM_ASSESSMENT_STATUS[1],
    });
  }

  async markAsInterviewPassed(item: ICandidateAssessmentInfo) {
    await this.update({
      ...item,
      interview_status: ENUM_ASSESSMENT_STATUS[2],
    });
  }

  async markAsManuallyPassed(item: ICandidateAssessmentInfo) {
    await this.update({
      ...item,
      manually_passed: true,
    });
    freelancerProfileService.updateTrustedStatus(item.email, "TRUSTED");
  }
}

export const candidateAssessmentInfoService = new CandidateAssessmentInfoService();
