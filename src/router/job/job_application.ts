import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("job/job_application");
const allRoutePath = getRoutePath("job/applied");
const applyRoutePath = getRoutePath("job/apply");

const getAllAppliedJobs = {
  handler: `${handlerPath}.getAll`,
  events: [
    {
      http: {
        method: "get",
        path: `${allRoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getByJobId = {
  handler: `${handlerPath}.getByJobPostingId`,
  events: [
    {
      http: {
        method: "get",
        path: `${allRoutePath}/job/{id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getByCompanyId = {
  handler: `${handlerPath}.getByCompanyId`,
  events: [
    {
      http: {
        method: "get",
        path: `${allRoutePath}/company/{id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getByFreelancerId = {
  handler: `${handlerPath}.getByFreelancerId`,
  events: [
    {
      http: {
        method: "get",
        path: `${allRoutePath}/freelancer/{id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const declineAnApplication = {
  handler: `${handlerPath}.declineAnApplication`,
  events: [
    {
      http: {
        method: "put",
        path: `${allRoutePath}/decline`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const interviewApplication = {
  handler: `${handlerPath}.interviewApplication`,
  events: [
    {
      http: {
        method: "put",
        path: `${allRoutePath}/interview`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.CLIENT],
};

// For talents
const applyForAJob = {
  handler: `${handlerPath}.applyForAJob`,
  events: [
    {
      http: {
        method: "post",
        path: `${applyRoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export {
  getAllAppliedJobs,
  getByCompanyId,
  getByJobId,
  getByFreelancerId,
  declineAnApplication,
  applyForAJob,
  interviewApplication,
};
