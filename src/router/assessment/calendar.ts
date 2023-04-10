import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("assessment/calendar");
const routePath = getRoutePath("assessment/calendar");

const getEventTypes = {
  handler: `${handlerPath}.getEventTypes`,
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

const getBookingByUid = {
  handler: `${handlerPath}.getBookingByUid`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}/bookingByUid`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const putBookingUid = {
  handler: `${handlerPath}.putBookingUid`,
  events: [
    {
      http: {
        method: "put",
        path: `${routePath}/putBookingUid`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export { getEventTypes, getBookingByUid, putBookingUid };
