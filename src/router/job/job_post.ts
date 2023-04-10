import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("job/job_post");
const routePath = getRoutePath("job/all");
const routeJobPath = getRoutePath("job");
const populateSkillsPath = getRoutePath("jobs/populateSkills");
const recommendRoutePath = getRoutePath("job/recommended");

const getAllPostedJobs = {
  handler: `${handlerPath}.getAll`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getRecommendedJobs = {
  handler: `${handlerPath}.getRecommendedJobs`,
  events: [
    {
      http: {
        method: "post",
        path: `${recommendRoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

// client side

const createJobPostings = {
  handler: `${handlerPath}.postAJobPosting`,
  events: [
    {
      http: {
        method: "post",
        path: `${routeJobPath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getJobPostingWithDynamicId = {
  handler: `${handlerPath}.getByDynamicId`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}/{from}/{id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const updatePostedJob = {
  handler: `${handlerPath}.updateAJobPosting`,
  events: [
    {
      http: {
        method: "put",
        path: `${routeJobPath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const populateSkills = {
  handler: `${handlerPath}.populateSkills`,
  events: [
    {
      http: {
        method: "get",
        path: `${populateSkillsPath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const deletePostedJob = {
  handler: `${handlerPath}.deleteById`,
  events: [
    {
      http: {
        method: "delete",
        path: `${routeJobPath}/remove/{company_id}/{job_id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export {
  getJobPostingWithDynamicId,
  updatePostedJob,
  deletePostedJob,
  getAllPostedJobs,
  getRecommendedJobs,
  createJobPostings,
  populateSkills,
};
