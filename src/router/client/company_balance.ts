import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("client/company_balance");
const routePath = getRoutePath("client/company/balance");

const getCompanyBalance = {
  handler: `${handlerPath}.getCompanyBalance`,
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

export { getCompanyBalance };
