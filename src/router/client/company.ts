import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("client/company");
const routePath = getRoutePath("client/company");

const getAllCompany = {
  handler: `${handlerPath}.getAllCompany`,
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

const updateCompanyDetail = {
  handler: `${handlerPath}.updateCompanyDetail`,
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

const updateCompanyLogo = {
  handler: `${handlerPath}.updateCompanyLogo`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/logo/{company_name}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const updateCompanyBanner = {
  handler: `${handlerPath}.updateCompanyBanner`,
  events: [
    {
      http: {
        method: "put",
        path: `${routePath}/banner/{company_name}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getCompanyInfo = {
  handler: `${handlerPath}.getCompanyInfo`,
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

export {
  getAllCompany,
  updateCompanyDetail,
  updateCompanyLogo,
  getCompanyInfo,
  updateCompanyBanner,
};
