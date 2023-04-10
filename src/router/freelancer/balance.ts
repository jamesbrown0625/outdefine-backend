import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("freelancer/balance");
const routePath = getRoutePath("freelancer/balance");

const getFreelanceBalance = {
  handler: `${handlerPath}.getFreelanceBalance`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}/{id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const saveFreelanceBalance = {
  handler: `${handlerPath}.saveFreelanceBalance`,
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

export { getFreelanceBalance, saveFreelanceBalance };
