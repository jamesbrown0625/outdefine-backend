import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("client/msa");
const routePath = getRoutePath("client/msa");

const getAllMSAs = {
  handler: `${handlerPath}.getAllMSAs`,
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

const uploadMSA = {
  handler: `${handlerPath}.uploadMSA`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/uploadMSA/{version}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const selectActiveMSA = {
  handler: `${handlerPath}.selectActiveMSA`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/selectActiveMSA`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getActiveMSA = {
  handler: `${handlerPath}.getActiveMSA`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}/getActiveMSA`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export { getAllMSAs, uploadMSA, selectActiveMSA, getActiveMSA };
