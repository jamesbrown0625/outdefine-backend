import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import {
  formatExceptionResponse,
  formatJSONResponse,
  middyfyForFreelancer,
  safeJsonArray,
  getSkillNameFromID,
  getSkillNamesFromIDs,
} from "@libs";
import { jobPostService, skillService } from "@service";
import { IJobsPosted } from "@interface";

const getAll = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const arg = event.queryStringParameters;

      const query = arg?.query ? arg?.query : "";
      const skip = parseInt(arg?.skip || "0");
      const limit = parseInt(arg?.limit || "5");
      const terms = arg?.terms ? arg.terms.split(",") : undefined;
      const location = arg?.location ? arg?.location.split(",") : undefined;
      const is_hourly = (arg?.is_hourly || "TRUE") === "true";
      const hourly_min_rate = parseInt(arg?.hourly_min_rate || "0");
      const hourly_max_rate = parseInt(arg?.hourly_max_rate || "200");
      const annual_min_rate = parseInt(arg?.annual_min_rate || "0");
      const annual_max_rate = parseInt(arg?.annual_max_rate || "200");
      const job_type = arg?.job_type ? parseInt(arg.job_type) : 1;
      const primary_skills = arg?.primary_skills
        ? arg.primary_skills.split(",").map((_str) => parseInt(_str))
        : undefined;
      const timezone = arg?.timezone ? arg.timezone.split(",") : undefined;
      const experience_level = arg?.experience_level ? arg?.experience_level?.split(",") : undefined;
      const visa_sponsor = arg?.visa_sponsor ? arg.visa_sponsor === "true" : undefined;

      const filters = {
        query,
        skip,
        limit,
        terms,
        location,
        is_hourly,
        hourly_min_rate,
        hourly_max_rate,
        annual_min_rate,
        annual_max_rate,
        job_type,
        primary_skills,
        timezone,
        experience_level,
        visa_sponsor,
      };

      const jobs = await jobPostService.getFilteredData(filters);

      return formatJSONResponse({
        total: jobs.length,
        skip,
        limit,
        jobs,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const getRecommendedJobs = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const profile: any = event.body;
      const arg = event.queryStringParameters;

      const skip = parseInt(arg?.skip || "0");
      const limit = parseInt(arg?.limit || "20");

      const query = arg?.query ? arg?.query : "";
      const terms = arg?.terms ? arg.terms.split(",") : undefined;
      const location = arg?.location ? arg?.location.split(",") : undefined;
      const is_hourly = (arg?.is_hourly || "TRUE") === "true";
      const hourly_min_rate = parseInt(arg?.hourly_min_rate || "0");
      const hourly_max_rate = parseInt(arg?.hourly_max_rate || "200");
      const job_type = arg?.job_type ? parseInt(arg.job_type) : 1;
      // const primary_skills = arg?.primary_skills
      //   ? arg.primary_skills.split(',').map((_str) => parseInt(_str))
      //   : undefined
      const timezone = arg?.timezone ? arg?.timezone?.split(",") : undefined;
      const experience_level = arg?.experience_level ? arg?.experience_level?.split(",") : undefined;
      const visa_sponsor = arg?.visa_sponsor ? arg.visa_sponsor === "true" : undefined;

      const filters = {
        query,
        skip,
        limit,
        terms,
        location,
        is_hourly,
        hourly_min_rate,
        hourly_max_rate,
        job_type,
        timezone,
        experience_level,
        visa_sponsor,
      };
      const jobs = await jobPostService.getRecommendedJobs(filters, profile);

      const rankedJobs = jobs.sort((a: any, b: any) => {
        const dateA: any = new Date(a.createdAt);
        const dateB: any = new Date(b.createdAt);
        const dateOrder = dateB - dateA;
        const scoreOrder = a.score - b.score;

        return scoreOrder || dateOrder;
      });

      return formatJSONResponse({
        total: rankedJobs?.length,
        skip,
        limit,
        jobs: rankedJobs || [],
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

// client side

const postAJobPosting = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const posting: IJobsPosted = JSON.parse(event.body);

      // TODO
      // check the role of the poster from the client_id only Admin, Recruiter, Hiring Manager can post jobs

      const postings = await jobPostService.createAJob({
        ...posting,
        status: "ACTIVE",
        date_posted: new Date(),
        date_last_activated: new Date(),
      });

      return formatJSONResponse({
        success: true,
        data: postings,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const updateAJobPosting = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const data: IJobsPosted = JSON.parse(event.body);
      const postings = await jobPostService.updateByPk(data);

      return formatJSONResponse({
        success: true,
        data: postings,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const populateSkills = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const arg = event.queryStringParameters;

      const skip = parseInt(arg?.skip || "0");
      const limit = parseInt(arg?.limit || "20");

      const query = arg?.query ? arg?.query : "";
      const terms = arg?.terms ? arg.terms.split(",") : undefined;
      const location = arg?.location ? arg?.location.split(",") : undefined;
      const is_hourly = (arg?.is_hourly || "TRUE") === "true";
      const hourly_min_rate = parseInt(arg?.hourly_min_rate || "0");
      const hourly_max_rate = parseInt(arg?.hourly_max_rate || "200");
      const job_type = arg?.job_type ? parseInt(arg.job_type) : 1;
      // const primary_skills = arg?.primary_skills
      //   ? arg.primary_skills.split(',').map((_str) => parseInt(_str))
      //   : undefined
      const timezone = arg?.timezone ? arg?.timezone?.split(",") : undefined;
      const experience_level = arg?.experience_level ? arg?.experience_level?.split(",") : undefined;
      const visa_sponsor = arg?.visa_sponsor ? arg.visa_sponsor === "true" : undefined;

      const filters = {
        query,
        skip,
        limit,
        terms,
        location,
        is_hourly,
        hourly_min_rate,
        hourly_max_rate,
        job_type,
        timezone,
        experience_level,
        visa_sponsor,
      };
      const jobs = await jobPostService.getFilteredData(filters);
      const skills = await skillService.getAll();
      await Promise.all(
        jobs.map(async (element) => {
          const skill_names = getSkillNamesFromIDs(skills, [
            ...safeJsonArray(element.dataValues.primary_skills),
            ...safeJsonArray(element.dataValues.secondary_skills),
          ]);
          const job_posting = { ...element.dataValues, skill_names: String(skill_names) };
          await jobPostService.updateByPk(job_posting);
        }),
      );

      // await Promise.all(files.map(async (file) => {
      //   const contents = await fs.readFile(file, 'utf8')
      //   console.log(contents)
      // }));

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const getByDynamicId = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const id = event.pathParameters.id;
      const from = event.pathParameters.from;

      if (id === undefined) {
        throw new Error("Company Id is not provided");
      }
      if (from === undefined) {
        throw new Error("Invalid request format, which id are you gonna get the job posting with?");
      }

      const data = await jobPostService.getByDynamicId(from, Number(id));
      return formatJSONResponse({
        data,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const deleteById = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const id = event.pathParameters.job_id;
      const company_id = event.pathParameters.company_id;

      if (id === undefined) {
        throw new Error("Job id is not provided");
      }
      if (company_id === undefined) {
        throw new Error("Invalid request format, Company id is missing");
      }

      // returns all job postings after removing
      const data = await jobPostService.safeRemoveById(Number(company_id), Number(id));

      return formatJSONResponse({
        success: true,
        data,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export {
  getAll,
  getRecommendedJobs,
  postAJobPosting,
  updateAJobPosting,
  getByDynamicId,
  deleteById,
  populateSkills,
};
