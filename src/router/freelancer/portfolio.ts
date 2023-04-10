import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("freelancer/portfolio");
const routePath = getRoutePath("freelancer/profile/portfolio");

const createFreelancerProfilePortfolio = {
  handler: `${handlerPath}.createFreelancerProfilePortfolio`,
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

const uploadPortfolioCoverImage = {
  handler: `${handlerPath}.uploadPortfolioCoverImage`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/uploadCoverImage`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const updateFreelancerPortfolio = {
  handler: `${handlerPath}.updateFreelancerPortfolio`,
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

const updateFreelancerPortfolioBatch = {
  handler: `${handlerPath}.updateFreelancerPortfolioBatch`,
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

const removeFreelancerProfilePortfolioBatch = {
  handler: `${handlerPath}.removeFreelancerProfilePortfolioBatch`,
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
  createFreelancerProfilePortfolio,
  uploadPortfolioCoverImage,
  updateFreelancerPortfolio,
  updateFreelancerPortfolioBatch,
  removeFreelancerProfilePortfolioBatch,
};
