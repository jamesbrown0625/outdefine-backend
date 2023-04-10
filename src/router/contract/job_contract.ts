import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("contract/job_contract");
const RoutePath = getRoutePath("job/contract");
const createDummyRoutePath = getRoutePath("job/offer/dummy");

const getAllContracts = {
  handler: `${handlerPath}.getAllContracts`,
  events: [
    {
      http: {
        method: "get",
        path: `${RoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getActiveCompaniesFromTalentID = {
  handler: `${handlerPath}.getCompaniesFromTalentID`,
  events: [
    {
      http: {
        method: "get",
        path: `${RoutePath}/companies/{id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getActiveTalentsFromCompanyID = {
  handler: `${handlerPath}.getTalentsFromCompanyID`,
  events: [
    {
      http: {
        method: "get",
        path: `${RoutePath}/talents/{id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getContractsFromDynamicID = {
  handler: `${handlerPath}.getContractsFromDynamicID`,
  events: [
    {
      http: {
        method: "get",
        path: `${RoutePath}/{from}/{id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const createContract = {
  handler: `${handlerPath}.createContract`,
  events: [
    {
      http: {
        method: "post",
        path: `${RoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const updateContract = {
  handler: `${handlerPath}.updateContract`,
  events: [
    {
      http: {
        method: "put",
        path: `${RoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const createDummyContracts = {
  handler: `${handlerPath}.createDummyOffers`,
  events: [
    {
      http: {
        method: "post",
        path: createDummyRoutePath,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export {
  getAllContracts,
  getActiveCompaniesFromTalentID,
  getActiveTalentsFromCompanyID,
  getContractsFromDynamicID,
  createContract,
  updateContract,
};
