import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("assessment/test_role_map");
const routePath = getRoutePath("assessment/test_role");

const getAllTestRoleMaps = {
  handler: `${handlerPath}.getAllTestRoleMaps`,
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

const addTestRoleMap = {
  handler: `${handlerPath}.addTestRoleMap`,
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
  permission: [USER_TYPES_PERMISSION.ADMIN],
};

const removeTestId = {
  handler: `${handlerPath}.removeTestId`,
  events: [
    {
      http: {
        method: "delete",
        path: `${routePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.ADMIN],
};

export { getAllTestRoleMaps, addTestRoleMap, removeTestId };
