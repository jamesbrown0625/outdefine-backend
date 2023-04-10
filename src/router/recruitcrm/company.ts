import { getRoutePath, getHandlerPath, USER_TYPES_PERMISSION } from "@config";
import { cors, authorizeConfig } from "@resource";

const handlerPath = getHandlerPath("recruitcrm/company");
const routePath = getRoutePath("recruitcrm/company");

const companyUpdatedEventHook = {
  handler: `${handlerPath}.companyUpdatedEventHook`,
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

export { companyUpdatedEventHook };
