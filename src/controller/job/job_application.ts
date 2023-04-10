import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import {
  clientProfileService,
  companyService,
  freelancerProfileService,
  jobApplicationService,
  jobPostService,
  sendEmailV1,
  userService,
  walletService,
} from "@service";
import { getApplicationAlertEmail, getInvitationAlertMail } from "@utils/email";
import { IJobsApplied, IJobsPosted } from "@interface";

// Get all job applications by freelancer id

const getAll = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const freelancer_id = event.queryStringParameters.freelancer_id;

      if (!freelancer_id) {
        throw new Error("Freelancer id is needed");
      }

      const jobs = await jobApplicationService.getByDynamicId(
        "freelancer_id",
        parseInt(freelancer_id),
      );

      return formatJSONResponse({
        total: jobs.length,
        jobs,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const getByJobPostingId = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const job_id = event.pathParameters.id;

      if (!job_id) {
        throw new Error("Job posting id is needed");
      }

      const jobs = await jobApplicationService.getByDynamicId("job_id", parseInt(job_id));

      return formatJSONResponse({
        total: jobs.length,
        jobs,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const getByCompanyId = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const company_id = event.pathParameters.id;

      if (!company_id) {
        throw new Error("Job posting id is needed");
      }

      const jobs = await jobApplicationService.getByDynamicId("company_id", parseInt(company_id));

      return formatJSONResponse({
        total: jobs.length,
        jobs,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const getByFreelancerId = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const freelancer_id = event.pathParameters.id;

      if (!freelancer_id) {
        throw new Error("Freelancer id is needed");
      }

      const jobs = await jobApplicationService.getByDynamicId(
        "freelancer_id",
        parseInt(freelancer_id),
      );

      return formatJSONResponse({
        total: jobs.length,
        jobs,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

// For freelancer decline invitation

const declineAnApplication = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);

      const { application_id, freelancer_id } = input;

      if (!application_id) {
        throw new Error("Application id is needed");
      }

      if (!freelancer_id) {
        throw new Error("freelancer id is needed");
      }

      await jobApplicationService.decline(application_id, freelancer_id);

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const interviewApplication = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);

      const { application_id, company_id, job_id, freelancer_id, introduction } = input;

      if (!application_id) {
        throw new Error("Application id is needed");
      }

      if (!company_id) {
        throw new Error("Company id is needed");
      }

      if (!job_id) {
        throw new Error("Job id is needed");
      }

      // TODO send SMS with "introduction"

      const application: IJobsApplied = await jobApplicationService.interviewApplication(
        application_id,
        company_id,
        freelancer_id,
      );

      const jobPosting: IJobsPosted = await jobPostService.getOneById(application.job_id);
      const talent = await userService.getOne(freelancer_id);

      const emailObject = getInvitationAlertMail({
        companyName: jobPosting.company_name,
        contractType: jobPosting.term,
        jobTitle: jobPosting.job_title,
        location: jobPosting.location,
        rate: `$${jobPosting.hourly_min_rate} - ${jobPosting.hourly_max_rate} /hr`,
        skills: jobPosting.skill_names.split(","),
        userName: `${talent.first_name} ${talent.last_name}`,
      });

      await sendEmailV1(emailObject, [talent.email_id], ["romil@outdefine.com"]);

      return formatJSONResponse({
        success: true,
        emailObject: emailObject,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

// For Talents

const applyForAJob = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const arg = JSON.parse(event.body);
      const { freelancer_id, job_id, company_id, cover_letter, token_amount } = arg;

      if (!freelancer_id) {
        throw new Error("Freelancer id is needed");
      }

      if (!company_id) {
        throw new Error("Company id is needed");
      }

      if (!job_id) {
        throw new Error("Job id is needed");
      }

      if (!cover_letter) {
        throw new Error("Cover letter is needed");
      }

      /*
       * check if he is vetted or not since vetted freelancers can only apply
       */

      const profile = await freelancerProfileService.getOneById(Number(freelancer_id));

      if (!profile.is_trusted_talent) {
        throw new Error("You are not a trusted talent");
      }

      // check the token balance
      if (token_amount) {
        try {
          await walletService.withdraw({ user_id: freelancer_id, amount: token_amount });
        } catch (e) {
          throw new Error("Withdrawal amount is more than balance");
        }
      }

      await jobApplicationService.applyForAJob({
        ...arg,
        boosted: !!token_amount,
      });

      const posting = await jobPostService.getOneById(job_id);
      const talent = await userService.getOne(freelancer_id);
      const client = await clientProfileService.getOneByCompanyId(company_id);
      const admin = await userService.getOne(client.client_id);

      const emailData = getApplicationAlertEmail({
        jobTitle: posting.job_title,
        companyAdminName: `${admin?.first_name} ${admin?.last_name}`,
        talentName: `${talent?.first_name} ${talent?.last_name}`,
      });
      await sendEmailV1(emailData, [admin.email_id]);

      return formatJSONResponse({
        success: true,
        admin,
        talent,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export {
  getAll,
  getByCompanyId,
  getByJobPostingId,
  getByFreelancerId,
  declineAnApplication,
  interviewApplication,
  applyForAJob,
};
