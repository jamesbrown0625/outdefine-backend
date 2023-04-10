import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("freelancer/profile");
const routePath = getRoutePath("freelancer/profile");
const vettedTalent = getRoutePath(`freelancer/vetted`);
const vettedTalentsWithAssessment = getRoutePath(`freelancer/vettedWithAssessment`);
const onboardingRoutePath = getRoutePath("freelancer/onboarding");

const getAllFreelancerProfile = {
  handler: `${handlerPath}.getAllFreelancerProfile`,
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

const getAllVettedTalent = {
  handler: `${handlerPath}.getAllVettedTalent`,
  events: [
    {
      http: {
        method: "get",
        path: `${vettedTalent}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getAllTalentsWithAssessmentInfo = {
  handler: `${handlerPath}.getAllTalentsWithAssessmentInfo`,
  events: [
    {
      http: {
        method: "get",
        path: `${vettedTalentsWithAssessment}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const createFreelancerProfile = {
  handler: `${handlerPath}.createFreelancerProfile`,
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

const handleFreelancerOnboardingStep1 = {
  handler: `${handlerPath}.handleFreelancerOnboardingStep1`,
  events: [
    {
      http: {
        method: "put",
        path: `${onboardingRoutePath}/step1`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const handleFreelancerOnboardingStep2 = {
  handler: `${handlerPath}.handleFreelancerOnboardingStep2`,
  events: [
    {
      http: {
        method: "put",
        path: `${onboardingRoutePath}/step2`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const handleFreelancerOnboardingStep3 = {
  handler: `${handlerPath}.handleFreelancerOnboardingStep3`,
  events: [
    {
      http: {
        method: "put",
        path: `${onboardingRoutePath}/step3`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const handleFreelancerOnboardingStep4 = {
  handler: `${handlerPath}.handleFreelancerOnboardingStep4`,
  events: [
    {
      http: {
        method: "put",
        path: `${onboardingRoutePath}/step4`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const updateFreelancerProfile = {
  handler: `${handlerPath}.updateFreelancerProfile`,
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

const getFreelancerProfile = {
  handler: `${handlerPath}.getFreelancerProfile`,
  // role: 'LambdaRDSRole',
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}/id/{id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getFreelancerProfileByEmail = {
  handler: `${handlerPath}.getFreelancerProfileByEmail`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}/email/{email}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.ADMIN],
};

const uploadResume = {
  handler: `${handlerPath}.uploadResumeAndSave`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/uploadResume/{email_id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export {
  getAllFreelancerProfile,
  getAllVettedTalent,
  getAllTalentsWithAssessmentInfo,
  createFreelancerProfile,
  updateFreelancerProfile,
  getFreelancerProfile,
  getFreelancerProfileByEmail,
  uploadResume,
  handleFreelancerOnboardingStep1,
  handleFreelancerOnboardingStep2,
  handleFreelancerOnboardingStep3,
  handleFreelancerOnboardingStep4,
};
