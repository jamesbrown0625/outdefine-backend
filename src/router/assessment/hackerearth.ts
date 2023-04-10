import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("assessment/hackerearth");
const routePath = getRoutePath("assessment/hackerearth");

const startMcqAssessment = {
  handler: `${handlerPath}.startMcqAssessment`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/startMcqAssessment`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER],
};

const startCodingAssessment = {
  handler: `${handlerPath}.startCodingAssessment`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/startCodingAssessment`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER],
};

const resetAssessment = {
  handler: `${handlerPath}.resetAssessment`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/resetAssessment`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const cancelInvite = {
  handler: `${handlerPath}.cancelInvite`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/cancelInvite`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const deleteTest = {
  handler: `${handlerPath}.deleteTest`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/deleteTest`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const publishTest = {
  handler: `${handlerPath}.publishTest`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/publishTest`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export {
  startMcqAssessment,
  startCodingAssessment,
  resetAssessment,
  cancelInvite,
  deleteTest,
  publishTest,
};
