import { getRoutePath, getHandlerPath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("authorizer/authorizer");
const isAuthorizedHandlerPath = getHandlerPath("authorizer/checkPermission");
const routePath = getRoutePath("authorizer");

const authorizer = {
  handler: `${handlerPath}.authorize`,
};

const isAuthorized = {
  handler: `${isAuthorizedHandlerPath}.isAuthorized`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/isAuthorized`,
        cors,
      },
    },
  ],
};

const authorizationTest = {
  handler: `${handlerPath}.authorizationTest`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}/test`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export { authorizer, isAuthorized, authorizationTest };
