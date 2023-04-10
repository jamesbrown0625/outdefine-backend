import { getRoutePath, getHandlerPath, USER_TYPES_PERMISSION } from "@config";
import { cors, authorizeConfig } from "@resource";

const handlerPath = getHandlerPath("recruitcrm/candidate");
const routePath = getRoutePath("recruitcrm/candidate");

const getCandidatesRecruitCRM = {
  handler: `${handlerPath}.getCandidatesRecruitCRM`,
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

const candidateUpdatedEventHook = {
  handler: `${handlerPath}.candidateUpdatedEventHook`,
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

export { getCandidatesRecruitCRM, candidateUpdatedEventHook };
