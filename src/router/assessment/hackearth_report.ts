import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("assessment/hackerearth_report");
const routePath = getRoutePath("assessment/hackerearth_report");

const putToHackerEarthreportLogs = {
  handler: `${handlerPath}.putToHackerEarthreportLogs`,
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

export { putToHackerEarthreportLogs };
