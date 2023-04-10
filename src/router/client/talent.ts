import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("client/talent");
const routePath = getRoutePath("client/talent");

const getFilteredTalents = {
  handler: `${handlerPath}.getFilteredTalents`,
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

export { getFilteredTalents };
