import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("contract/review");
const RoutePath = getRoutePath("contract/review");

const getAllReviews = {
  handler: `${handlerPath}.getAllReviews`,
  events: [
    {
      http: {
        method: "get",
        path: `${RoutePath}/dir/{direction}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getAllReviewsForACompany = {
  handler: `${handlerPath}.getAllReviewsForACompany`,
  events: [
    {
      http: {
        method: "get",
        path: `${RoutePath}/company/{company_id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getAllReviewsForAFreelancer = {
  handler: `${handlerPath}.getAllReviewsForAFreelancer`,
  events: [
    {
      http: {
        method: "get",
        path: `${RoutePath}/freelancer/{freelancer_id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export { getAllReviews, getAllReviewsForACompany, getAllReviewsForAFreelancer };
