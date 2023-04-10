import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("token/wallet");
const getBalanceRoutePath = getRoutePath("token/getBalance");
const withdrawBalanceRoutePath = getRoutePath("token/withdrawBalance");

const getWalletBalance = {
  handler: `${handlerPath}.getBalanceByUserId`,
  events: [
    {
      http: {
        method: "get",
        path: `${getBalanceRoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const withdrawBalance = {
  handler: `${handlerPath}.withdrawBalanceByUserId`,
  events: [
    {
      http: {
        method: "put",
        path: `${withdrawBalanceRoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export { getWalletBalance, withdrawBalance };
