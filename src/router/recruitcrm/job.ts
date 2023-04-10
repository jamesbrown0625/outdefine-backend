import { getRoutePath, getHandlerPath, USER_TYPES_PERMISSION } from "@config";
import { cors, authorizeConfig } from "@resource";

const handlerPath = getHandlerPath("recruitcrm/job");
const routePath = getRoutePath("recruitcrm/job");

const jobUpdatedEventHook = {
  handler: `${handlerPath}.jobUpdatedEventHook`,
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

const jobAppliedStatusUpdateEventHook = {
  handler: `${handlerPath}.jobAppliedStatusUpdateEventHook`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/jobAppliedStatusUpdateEventHook`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export { jobUpdatedEventHook, jobAppliedStatusUpdateEventHook };
