import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import {
  companyService,
  jobApplicationService,
  jobInvitationService,
  jobPostService,
  sendEmailV1,
  userService,
} from "@service";
import { IJobInvitation } from "../../interface/job/IJobInvitation";
import { getInvitationToApplyAlertMail } from "@utils/email";

const getInvitationsByDynamicId = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const id = event.pathParameters.id;
      const from = event.pathParameters.from;

      if (from === undefined || id === undefined) {
        throw new Error("Request format is invalid");
      }

      if (!["freelancer", "company"].includes(from)) {
        throw new Error("From type is invalid");
      }

      const invitations = await jobInvitationService.getByDynamicId(
        from as "freelancer" | "company",
        parseInt(id),
      );

      return formatJSONResponse({
        success: true,
        invitations,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const inviteTalent = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const invitation: IJobInvitation = JSON.parse(event.body);
      const { link, company_id, freelancer_id, introduction, job_id } = invitation;

      if (
        link === undefined ||
        company_id === undefined ||
        freelancer_id === undefined ||
        introduction === undefined ||
        job_id === undefined
      ) {
        throw new Error("Undefined value in request that should not be in");
      }

      const createdOne = await jobInvitationService.create(invitation);

      const company = await companyService.getOneById(company_id);
      const jobPosting = await jobPostService.getOneById(job_id);
      const talent = await userService.getOneByUserId(freelancer_id);

      const mailObject = getInvitationToApplyAlertMail({
        companyName: company.name,
        jobTitle: jobPosting.job_title,
        location: jobPosting.location,
        rate: `$${jobPosting.hourly_min_rate} - ${jobPosting.hourly_max_rate} /hr`,
        talentName: `${talent.first_name} ${talent.last_name}`,
      });

      await sendEmailV1(mailObject, [talent.email_id], ["romil@outdefine.com"]);

      return formatJSONResponse({
        success: true,
        invitation: createdOne,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const acceptInvitation = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const arg = JSON.parse(event.body);
      const { freelancer_id, job_id, company_id } = arg;

      if (!freelancer_id) {
        throw new Error("Freelancer id is needed");
      }

      if (!company_id) {
        throw new Error("Company id is needed");
      }

      if (!job_id) {
        throw new Error("Job id is needed");
      }

      const is_invited = await jobInvitationService.findInvitation(
        Number(freelancer_id),
        Number(job_id),
      );

      if (!is_invited) {
        throw new Error("No invitation found");
      }

      const application = await jobApplicationService.acceptInvitation(
        job_id,
        company_id,
        freelancer_id,
      );
      if (application) {
        await jobInvitationService.remove(job_id, company_id, freelancer_id);
      }

      return formatJSONResponse({
        success: true,
        data: application,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const declineInvitation = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const arg = JSON.parse(event.body);
      const { freelancer_id, job_id, company_id } = arg;

      if (!freelancer_id) {
        throw new Error("Freelancer id is needed");
      }

      if (!company_id) {
        throw new Error("Company id is needed");
      }

      if (!job_id) {
        throw new Error("Job id is needed");
      }

      const invitation = await jobInvitationService.findInvitation(
        Number(freelancer_id),
        Number(job_id),
      );

      if (!invitation) {
        throw new Error("No invitation found");
      }

      await jobInvitationService.decline(job_id, company_id, freelancer_id);

      return formatJSONResponse({
        success: true,
        data: invitation,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { getInvitationsByDynamicId, inviteTalent, acceptInvitation, declineInvitation };
