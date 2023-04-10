import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("client/profile");
const routePath = getRoutePath("client/profile");

const joinCompany = {
  handler: `${handlerPath}.joinCompany`,
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

const updateClientProfile = {
  handler: `${handlerPath}.updateClientProfile`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/updateClientProfile`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const updateTeamMember = {
  handler: `${handlerPath}.updateTeamMember`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/updateTeamMember`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getTeamMembers = {
  handler: `${handlerPath}.getTeamMembers`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/getTeamMembers`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const inviteMembers = {
  handler: `${handlerPath}.inviteMembers`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/inviteMembers`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const addClients = {
  handler: `${handlerPath}.addClients`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/addClients`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const updateOnboardingStatus = {
  handler: `${handlerPath}.updateOnboardingStatus`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/updateOnboardingStatus`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getClientProfile = {
  handler: `${handlerPath}.getClientProfile`,
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

const removeClientProfile = {
  handler: `${handlerPath}.removeClientProfile`,
  events: [
    {
      http: {
        method: "delete",
        path: `${routePath}/{id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export {
  joinCompany,
  updateClientProfile,
  addClients,
  updateOnboardingStatus,
  getClientProfile,
  inviteMembers,
  getTeamMembers,
  updateTeamMember,
  removeClientProfile,
};
