import { getDB } from "@model";
import { sendEmail } from "../email";
import { getInviteToApplyTemplate } from "@resource";
import { clientProfileService, companyService } from "../client";
import { userService } from "../user";
import { jobPostService } from "./job_post";
import { IJobInvitation } from "@interface";

export default class JobInvitationService {
  async getTable() {
    return (await getDB()).JobInvitation;
  }

  async getByDynamicId(from: "freelancer" | "company", id: number) {
    const table = await this.getTable();

    return table.findAll({
      where: {
        [`${from}_id`]: id,
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

  async create({ id, ...invitation }: IJobInvitation) {
    const table = await this.getTable();
    // const teammates = await clientProfileService.getAllTeamMembers(invitation.company_id)
    // const company = await companyService.getOneById(invitation.company_id)
    // const posting = await jobPostService.getOneById(invitation.job_id)
    // const user = await userService.getOneByUserId(invitation.freelancer_id)

    // const contact_info: { name: string; company_name: string; position: string } = {
    //   name: '',
    //   company_name: '',
    //   position: '',
    // }

    // for (let i = 0; i < teammates.length; i++) {
    //   if (['HIRING MANAGER', 'ADMIN'].includes(teammates[i]?.position)) {
    //     contact_info.name =
    //       (teammates[i]?.User?.first_name ?? 'John') +
    //       ' ' +
    //       (teammates[i]?.User?.last_name ?? 'Doe')
    //     break
    //   }
    // }

    // contact_info.company_name = company.name
    // contact_info.position = posting.job_title

    // await sendEmail(
    //   getInviteToApplyTemplate(
    //     contact_info.name,
    //     contact_info.company_name,
    //     user.first_name + ' ' + user.last_name,
    //     contact_info.position,
    //     invitation.link,
    //   ),
    //   [user.email_id],
    // )

    return table.create(invitation);
  }

  async remove(
    job_id: string | number,
    company_id: string | number,
    freelancer_id: string | number,
  ) {
    const table = await this.getTable();

    return table.destroy({
      where: {
        job_id,
        company_id,
        freelancer_id,
      },
    });
  }

  async decline(
    job_id: string | number,
    company_id: string | number,
    freelancer_id: string | number,
  ) {
    const table = await this.getTable();

    const invitation = await table.findOne({
      where: {
        job_id,
        company_id,
        freelancer_id,
      },
    });

    await invitation.update({ is_declined: true });
    await invitation.save();

    return invitation;
  }

  async findInvitation(freelancer_id: number, job_id: number) {
    const table = await this.getTable();
    return table.findOne({
      where: {
        freelancer_id,
        job_id,
      },
    });
  }
}

export const jobInvitationService = new JobInvitationService();
