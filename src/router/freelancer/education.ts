import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("freelancer/education");
const routePath = getRoutePath("freelancer/profile/education");

const updateFreelancerEducation = {
  handler: `${handlerPath}.updateFreelancerEducation`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const createFreelancerProfileEducation = {
  handler: `${handlerPath}.createFreelancerProfileEducation`,
  events: [
    {
      http: {
        method: "put",
        path: `${routePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const updateFreelancerEducationBatch = {
  handler: `${handlerPath}.updateFreelancerEducationBatch`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/batch`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const removeFreelancerProfileEducationBatch = {
  handler: `${handlerPath}.removeFreelancerProfileEducationBatch`,
  events: [
    {
      http: {
        method: "delete",
        path: `${routePath}/batch`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export {
  updateFreelancerEducation,
  createFreelancerProfileEducation,
  updateFreelancerEducationBatch,
  removeFreelancerProfileEducationBatch,
};
