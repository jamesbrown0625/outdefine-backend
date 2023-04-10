import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("assessment/test_bank");
const routePath = getRoutePath("assessment/test_bank");

const getAllTestBanks = {
  handler: `${handlerPath}.getAllTestBanks`,
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

const getAssessmentForFreelancer = {
  handler: `${handlerPath}.getAssessmentForFreelancer`,
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

const syncTestBanks = {
  handler: `${handlerPath}.syncTableLists`,
  events: [
    {
      http: {
        method: "put",
        path: `${routePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const setToGeneralCodingTest = {
  handler: `${handlerPath}.setToGeneralCodingTest`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/setToGeneralCodingTest`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getAssessmentData = {
  handler: `${handlerPath}.getAssessmentData`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}/getAssessmentData`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER],
};

export {
  getAllTestBanks,
  getAssessmentForFreelancer,
  syncTestBanks,
  setToGeneralCodingTest,
  getAssessmentData,
};
