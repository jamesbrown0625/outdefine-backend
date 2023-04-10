import { getDB } from "@model";
import { invokeLambda } from "@libs";

class JobApplicationService {
  async getTable() {
    return (await getDB()).JobApplication;
  }

  async getByDynamicId(field_name: string, id: number) {
    const table = await this.getTable();
    return table.findAll({
      where: {
        [field_name]: id,
      },
      include: [
        {
          model: (await getDB()).JobPosting,
          as: "PostedJobs",
          include: [
            {
              model: (await getDB()).Company,
              as: "Company",
              include: [
                {
                  model: (await getDB()).CompanySocialLink,
                  as: "CompanySocialLink",
                },
              ],
            },
          ],
        },
        {
          model: (await getDB()).User,
          as: "User",
        },
        {
          model: (await getDB()).FreelancerProfile,
          as: "FreelancerProfile",
          include: [
            {
              model: (await getDB()).Skill,
              as: "skills",
            },
          ],
        },
      ],
    });
  }

  async decline(application_id: number, freelancer_id: number) {
    const table = await this.getTable();
    const application = await table.findOne({ where: { id: application_id, freelancer_id } });

    if (!application) {
      throw new Error("Application does not exist");
    }

    application.application_status = "REJECTED";
    await application.save();

    await invokeLambda("jobAppliedStatusUpdateEventHook", {
      body: JSON.stringify({
        ...application,
        application_status: "REJECTED",
      }),
    });
  }

  async updateToInterviewing(application_id: number, company_id: number, freelancer_id: number) {
    const table = await this.getTable();
    const application = await table.findOne({
      where: { id: application_id, company_id, freelancer_id },
    });

    await application.update({ application_status: "INTERVIEW" });
    await application.save();

    await invokeLambda("jobAppliedStatusUpdateEventHook", {
      body: JSON.stringify({
        ...application,
        application_status: "INTERVIEW",
      }),
    });

    return application;
  }

  async updateToArchived(application_id: number) {
    const table = await this.getTable();
    const application = await table.findOne({
      where: { id: application_id },
    });

    await application.update({ application_status: "ARCHIVED" });
    await application.save();

    await invokeLambda("jobAppliedStatusUpdateEventHook", {
      body: JSON.stringify({
        ...application,
        application_status: "ARCHIVED",
      }),
    });

    return application;
  }

  async interviewApplication(
    application_id: number,
    company_id: number | string,
    freelancer_id: number | string,
  ) {
    const table = await this.getTable();
    const application = await table.findOne({
      where: { id: application_id, company_id, freelancer_id },
    });

    await application.update({ application_status: "INTERVIEW" });
    await application.save();

    return application;
  }

  // For Talents

  async applyForAJob(arg: ApplyPropsType) {
    const table = await this.getTable();
    const result = await table.create({ ...arg, application_status: "APPLIED" });

    await invokeLambda("jobAppliedStatusUpdateEventHook", {
      body: JSON.stringify({
        ...arg,
        application_status: "APPLIED",
      }),
    });

    return result;
  }

  async acceptInvitation(job_id: number, company_id: number, freelancer_id: number) {
    const table = await this.getTable();
    const result = await table.create({
      freelancer_id,
      company_id,
      job_id,
      application_status: "INTERVIEW",
      is_invited: true,
    });

    // TODO invote Lamda if needed
    return result;
  }

  async removeByPK(id: number) {
    const table = await this.getTable();
    return table.destroy({ where: { id } });
  }
}

export const jobApplicationService = new JobApplicationService();
