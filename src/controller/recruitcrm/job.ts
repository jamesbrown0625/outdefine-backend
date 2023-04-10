import { isInDevelopment, PREFIX_RECRUITCRM } from "@config";
import {
  formatExceptionResponse,
  formatJSONResponse,
  getMaximumExperienceLevel,
  getMinimumExperienceLevel,
  invokeLambdaSync,
  middyfyForInvokedFunctions,
  nullToEmptyString,
  nullToUndefined,
} from "@libs";
import {
  clientProfileService,
  companyService,
  freelancerProfileService,
  jobPostService,
} from "@service";
import { APIGatewayProxyEvent } from "aws-lambda";
import { recruitCRMJobService } from "src/service/recruitcrm";

const jobUpdatedEventHook = middyfyForInvokedFunctions(async (event: APIGatewayProxyEvent) => {
  try {
    if (isInDevelopment()) {
      return formatJSONResponse({
        success: true,
      });
    }

    const id = JSON.parse(event.body).id;

    const job = await jobPostService.getOneById(id);
    if (job === null) throw new Error("Job Posted Item does not exist");

    let client = await clientProfileService.getOneByClientId(job.client_id);
    if (client === null) throw new Error("Client does not exist");

    if (client.recruitcrm_slug === null) {
      await invokeLambdaSync("contactUpdatedEventHook", {
        body: JSON.stringify({
          client_id: client.client_id,
        }),
      });
      client = await clientProfileService.getOneByClientId(job.client_id);
    }
    if (client.recruitcrm_slug === null) {
      throw new Error("Client profile slug field is empty");
    }

    const company = await companyService.getOneById(job.company_id);
    if (company === null) throw new Error("Company does not exist");
    if (company.recruitcrm_slug === null) {
      throw new Error("Company slug field is empty");
    }

    const recruitJobTitle = `${PREFIX_RECRUITCRM}${job.job_title}`;
    let jobTobeUpdated = {
      name: recruitJobTitle,
      number_of_openings: Number(job.number_of_hires),
      company_slug: company.recruitcrm_slug,
      contact_slug: client.recruitcrm_slug,
      job_description_text: nullToEmptyString(job.description),
      minimum_experience: getMinimumExperienceLevel(job.experience_level),
      maximum_experience: getMaximumExperienceLevel(job.experience_level),
      salary_type: 5,
      min_annual_salary: nullToUndefined(job.hourly_min_rate),
      max_annual_salary: nullToUndefined(job.hourly_max_rate),
      specialization: nullToUndefined(job.job_title),
      city: nullToUndefined(company.city),
      locality: nullToUndefined(company.city),
      state: nullToUndefined(company.city),
      country: nullToUndefined(company.country),
      custom_fields: [
        {
          field_id: 3, // Type
          value:
            job.term === "FULL TIME"
              ? "Full-Time Contract"
              : job.term === "PART TIME"
                ? "Part-Time Contract"
                : job.term === "DIRECT HIRE"
                  ? "Full-Time Direct Hire"
                  : undefined,
        },
        {
          field_id: 2, // Total Estimated Salary
          value: job.hourly_max_rate === null ? 0 : job.hourly_max_rate * 40 * 52,
        },
      ],
    };

    jobTobeUpdated = JSON.parse(JSON.stringify(jobTobeUpdated));

    let res;
    if (job.recruitcrm_slug === null) {
      // create a new item on recruitcrm, then update slug
      // const recruitCompanyName = `${PREFIX_RECRUITCRM}${job.company_name}`
      // const result = await recruitCRMJobService.getOneByName(recruitCompanyName, recruitJobTitle)
      // if (result === null) {
      res = await recruitCRMJobService.create(jobTobeUpdated);
      // } else {
      // res = await recruitCRMJobService.update(result.slug, jobTobeUpdated)
      // }
      await jobPostService.updateRecruitSlug(job.id, res.data.slug);
    } else {
      res = await recruitCRMJobService.update(job.recruitcrm_slug, jobTobeUpdated);
    }

    return formatJSONResponse({
      success: true,
      response: res.data,
    });
  } catch (e) {
    return formatExceptionResponse(e);
  }
});

const jobAppliedStatusUpdateEventHook = middyfyForInvokedFunctions(
  async (event: APIGatewayProxyEvent) => {
    try {
      if (isInDevelopment()) {
        return formatJSONResponse({
          success: true,
        });
      }

      const { freelancer_id, job_id, application_status } = JSON.parse(event.body);

      if (!freelancer_id) throw new Error("Freelancer id was not provided");
      if (!job_id) throw new Error("Job id was not provided");

      const freelancer = await freelancerProfileService.getOneById(freelancer_id);
      if (!freelancer) throw new Error("Freelancer does not exist");
      if (!freelancer.recruitcrm_slug) {
        throw new Error("Freelancer recruit_crm_slug field is empty");
      }

      const job = await jobPostService.getOneById(job_id);
      if (job === null) throw new Error("Job Posted Item does not exist");
      if (job.recruitcrm_slug === null) {
        throw new Error("Job recruit_crm_slug field is empty");
      }

      let res;
      switch (application_status) {
        case "INTERVIEW":
          res = await recruitCRMJobService.interviewCandidate(
            freelancer.recruitcrm_slug,
            job.recruitcrm_slug,
          );
          break;
        case "REVIEW":
          res = await recruitCRMJobService.submitCandidate(
            freelancer.recruitcrm_slug,
            job.recruitcrm_slug,
          );
          break;
        case "REJECTED":
          res = await recruitCRMJobService.rejectCandidate(
            freelancer.recruitcrm_slug,
            job.recruitcrm_slug,
          );
          break;
        default:
          res = await recruitCRMJobService.assignCandidate(
            freelancer.recruitcrm_slug,
            job.recruitcrm_slug,
          );
          break;
      }

      return formatJSONResponse({
        success: true,
        response: res.data,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { jobUpdatedEventHook, jobAppliedStatusUpdateEventHook };
