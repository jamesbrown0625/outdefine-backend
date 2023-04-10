import { USER_TYPES_PERMISSION, getHandlerPath, getRoutePath } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("assessment/admin");
const adminUIRoutePath = getRoutePath("assessment/admin");

const markIntroductionAsPassed11 = {
  handler: `${handlerPath}.markIntroductionAsPassed`,
  events: [
    {
      http: {
        method: "post",
        path: `${adminUIRoutePath}/markIntroductionAsPassed11`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.ADMIN],
};

const markHackerearthAsPassed = {
  handler: `${handlerPath}.markHackerearthAsPassed`,
  events: [
    {
      http: {
        method: "post",
        path: `${adminUIRoutePath}/markHackerearthAsPassed`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.ADMIN],
};

const markInterviewAsPassed = {
  handler: `${handlerPath}.markInterviewAsPassed`,
  events: [
    {
      http: {
        method: "post",
        path: `${adminUIRoutePath}/markInterviewAsPassed`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.ADMIN],
};
// 
export { markIntroductionAsPassed11 };
