import { getRoutePath, getHandlerPath, USER_TYPES_PERMISSION } from "@config";
import { cors, authorizeConfig } from "@resource";

const handlerPath = getHandlerPath("sentry");
const routePath = getRoutePath("sentry");

const testSentry500 = {
  handler: `${handlerPath}.testSentry500`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}/500`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const testSentryException = {
  handler: `${handlerPath}.testSentryException`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}/exception`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const testSentrySuccess = {
  handler: `${handlerPath}.testSentrySuccess`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}/success`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export { testSentry500, testSentryException, testSentrySuccess };
