import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("assessment/assessment_info");
const getCandidateAssessmentInfoRoutePath = getRoutePath("assessment/report/getOneByEmail");
const updateCandidateAssessmentInfoRoutePath = getRoutePath("assessment/report/updateOneByEmail");
const getCandidateAssessmentInfoByEmailRoutePath = getRoutePath("assessment/info/getOneByEmail");
const confirmCandidateRoleRoutePath = getRoutePath("assessment/info/confirmCandidateRole");
const cancelCandidateRoleConfirmationRoutePath = getRoutePath(
  "assessment/info/cancelCandidateRoleConfirmation",
);
const updateInterviewScheduledRoutePath = getRoutePath("assessment/info/updateInterviewScheduled");
const updateIntroductionStatusRoutePath = getRoutePath("assessment/info/updateIntroductionStatus");

const getCandidateAssessmentInfo = {
  handler: `${handlerPath}.getCandidateAssessmentInfo`,
  events: [
    {
      http: {
        method: "get",
        path: `${getCandidateAssessmentInfoRoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getCandidateAssessmentInfoByEmail = {
  handler: `${handlerPath}.getCandidateAssessmentInfoByEmail`,
  events: [
    {
      http: {
        method: "get",
        path: `${getCandidateAssessmentInfoByEmailRoutePath}/{email_id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const updateCandidateAssessmentInfoRecord = {
  handler: `${handlerPath}.updateCandidateAssessmentInfoRecord`,
  events: [
    {
      http: {
        method: "post",
        path: `${updateCandidateAssessmentInfoRoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const confirmCandidateRole = {
  handler: `${handlerPath}.confirmCandidateRole`,
  events: [
    {
      http: {
        method: "post",
        path: `${confirmCandidateRoleRoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const cancelCandidateRoleConfirmation = {
  handler: `${handlerPath}.cancelCandidateRoleConfirmation`,
  events: [
    {
      http: {
        method: "post",
        path: `${cancelCandidateRoleConfirmationRoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const updateInterviewScheduled = {
  handler: `${handlerPath}.updateCandidateInterviewScheduled`,
  events: [
    {
      http: {
        method: "post",
        path: `${updateInterviewScheduledRoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const updateIntroductionStatus = {
  handler: `${handlerPath}.updateIntroductionStatus`,
  events: [
    {
      http: {
        method: "post",
        path: `${updateIntroductionStatusRoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export {
  getCandidateAssessmentInfo,
  updateCandidateAssessmentInfoRecord,
  getCandidateAssessmentInfoByEmail,
  updateInterviewScheduled,
  confirmCandidateRole,
  cancelCandidateRoleConfirmation,
  updateIntroductionStatus,
};
