import { getRoutePath, getHandlerPath, USER_TYPES_PERMISSION } from "@config";
import { cors, authorizeConfig } from "@resource";

const handlerPath = getHandlerPath("recruitcrm/contact");
const routePath = getRoutePath("recruitcrm/contact");

const contactUpdatedEventHook = {
  handler: `${handlerPath}.contactUpdatedEventHook`,
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

export { contactUpdatedEventHook };
