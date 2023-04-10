import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("job/job_offer");
const RoutePath = getRoutePath("job/offer");
const withdrawRoutePath = getRoutePath("job/offer/withdraw");
const allRoutePath = getRoutePath("job/offer/all");
const createDummyRoutePath = getRoutePath("job/offer/dummy");

const getOffersById = {
  handler: `${handlerPath}.getOffersById`,
  events: [
    {
      http: {
        method: "get",
        path: `${allRoutePath}/{from}/{id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const makeAnOffer = {
  handler: `${handlerPath}.makeAnOffer`,
  events: [
    {
      http: {
        method: "post",
        path: RoutePath,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const addressAnOffer = {
  handler: `${handlerPath}.addressAnOffer`,
  events: [
    {
      http: {
        method: "put",
        path: RoutePath,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const withdrawAnOffer = {
  handler: `${handlerPath}.withdrawAnOffer`,
  events: [
    {
      http: {
        method: "put",
        path: withdrawRoutePath,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const createDummyOffers = {
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

export { getOffersById, makeAnOffer, withdrawAnOffer, addressAnOffer, createDummyOffers };
