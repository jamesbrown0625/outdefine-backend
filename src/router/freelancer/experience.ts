import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("freelancer/experience");
const routePath = getRoutePath("freelancer/profile/experience");

const updateFreelancerExperience = {
  handler: `${handlerPath}.updateFreelancerExperience`,
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

const createFreelancerProfileExperience = {
  handler: `${handlerPath}.createFreelancerProfileExperience`,
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

const updateFreelancerExperienceBatch = {
  handler: `${handlerPath}.updateFreelancerExperienceBatch`,
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

const removeFreelancerProfileExperienceBatch = {
  handler: `${handlerPath}.removeFreelancerProfileExperienceBatch`,
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
  createFreelancerProfileExperience,
  updateFreelancerExperienceBatch,
  updateFreelancerExperience,
  removeFreelancerProfileExperienceBatch,
};
