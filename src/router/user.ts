import { getRoutePath, getHandlerPath, userPoolName, USER_TYPES_PERMISSION } from "@config";
import { cors, authorizeConfig } from "@resource";
import { ICognitoUserPoolType } from "src/interface/ICognitoUserPoolType";

const handlerPath = getHandlerPath("user");
const routePath = getRoutePath("user");

const getAllUsers = {
  handler: `${handlerPath}.getAll`,
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

const updateUser = {
  handler: `${handlerPath}.updateUser`,
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

const createUserAfterSignUp: ICognitoUserPoolType = {
  handler: `${handlerPath}.createUserAfterSignUp`,
  events: [
    {
      cognitoUserPool: {
        pool: userPoolName,
        trigger: "PreSignUp",
        existing: true,
      },
    },
  ],
};

const preAuthenticationTrigger: ICognitoUserPoolType = {
  handler: `${handlerPath}.preAuthenticationTrigger`,
  events: [
    {
      cognitoUserPool: {
        pool: userPoolName,
        trigger: "PreAuthentication",
        existing: true,
      },
    },
  ],
};

const createUser = {
  handler: `${handlerPath}.createUser`,
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

const signUp = {
  handler: `${handlerPath}.signUp`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/signup`,
        cors,
      },
    },
  ],
};

const getUser = {
  handler: `${handlerPath}.getUser`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}/{email_id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const updateUserAvatar = {
  handler: `${handlerPath}.updateUserAvatar`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/avatar/{email_id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const updateUserBanner = {
  handler: `${handlerPath}.updateUserBanner`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/banner/{email_id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const customMessageTrigger: ICognitoUserPoolType = {
  handler: `${handlerPath}.customMessageTrigger`,
  events: [
    {
      cognitoUserPool: {
        pool: userPoolName,
        trigger: "CustomMessage",
        existing: true,
      },
    },
  ],
};

export {
  getAllUsers,
  updateUser,
  createUser,
  createUserAfterSignUp,
  preAuthenticationTrigger,
  signUp,
  getUser,
  updateUserAvatar,
  updateUserBanner,
  customMessageTrigger,
};
