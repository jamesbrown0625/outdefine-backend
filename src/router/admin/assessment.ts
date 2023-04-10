import { USER_TYPES_PERMISSION, getHandlerPath, getRoutePath } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("assessment/assessment_info");
const adminUIRoutePath = getRoutePath("assessment/admin");

const saveIntroducePanel = {
  handler: `${handlerPath}.saveIntroducePanel`,
  events: [
    {
      http: {
        method: "post",
        path: `${adminUIRoutePath}/saveIntroducePanel`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.ADMIN],
};

const saveCodingAssessmentPanel = {
  handler: `${handlerPath}.saveCodingAssessmentPanel`,
  events: [
    {
      http: {
        method: "post",
        path: `${adminUIRoutePath}/saveCodingAssessmentPanel`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.ADMIN],
};

const saveMcqAssessmentPanel = {
  handler: `${handlerPath}.saveMcqAssessmentPanel`,
  events: [
    {
      http: {
        method: "post",
        path: `${adminUIRoutePath}/saveMcqAssessmentPanel`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.ADMIN],
};

const unlockInterview = {
  handler: `${handlerPath}.unlockInterview`,
  events: [
    {
      http: {
        method: "post",
        path: `${adminUIRoutePath}/unlockInterview`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.ADMIN],
};

const saveBehavioralInterviewResult = {
  handler: `${handlerPath}.saveBehavioralInterviewResult`,
  events: [
    {
      http: {
        method: "post",
        path: `${adminUIRoutePath}/saveBehavioralInterviewResult`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.ADMIN],
};

const saveTechnicalSkillResult = {
  handler: `${handlerPath}.saveTechnicalSkillResult`,
  events: [
    {
      http: {
        method: "post",
        path: `${adminUIRoutePath}/saveTechnicalSkillResult`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.ADMIN],
};

const sendInterviewEmailReminder = {
  handler: `${handlerPath}.sendInterviewEmailReminder`,
  events: [
    {
      http: {
        method: "post",
        path: `${adminUIRoutePath}/sendInterviewEmailReminder`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.ADMIN],
};

const sendAssessmentEmailReminder = {
  handler: `${handlerPath}.sendAssessmentEmailReminder`,
  events: [
    {
      http: {
        method: "post",
        path: `${adminUIRoutePath}/sendAssessmentEmailReminder`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.ADMIN],
};

const moveToVet = {
  handler: `${handlerPath}.moveToVet`,
  events: [
    {
      http: {
        method: "post",
        path: `${adminUIRoutePath}/moveToVet`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.ADMIN],
};

const makeTrustedMember = {
  handler: `${handlerPath}.makeTrustedMember`,
  events: [
    {
      http: {
        method: "post",
        path: `${adminUIRoutePath}/makeTrustedMember`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.ADMIN],
};

const declineTalent = {
  handler: `${handlerPath}.declineTalent`,
  events: [
    {
      http: {
        method: "post",
        path: `${adminUIRoutePath}/declineTalent`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.ADMIN],
};

export {
  sendInterviewEmailReminder,
  
  makeTrustedMember,
  declineTalent,
  sendAssessmentEmailReminder,
  saveIntroducePanel,
  saveCodingAssessmentPanel,
  saveMcqAssessmentPanel,

  saveBehavioralInterviewResult,
  saveTechnicalSkillResult,
};
