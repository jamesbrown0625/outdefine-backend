import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("token/freelancer_reward");
const getRewardHistoryRoutePath = getRoutePath("token/getRewardHistory");
const getAggregatedRewardsRoutePath = getRoutePath("token/getAggregatedRewards");
const addFreelancerRewardRoutePath = getRoutePath("token/addFreelancerReward");

const getRewardHistory = {
  handler: `${handlerPath}.getRewardHistoryByUserId`,
  events: [
    {
      http: {
        method: "get",
        path: `${getRewardHistoryRoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getAggregatedRewards = {
  handler: `${handlerPath}.getAggregatedRewards`,
  events: [
    {
      http: {
        method: "get",
        path: `${getAggregatedRewardsRoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const addFreelancerReward = {
  handler: `${handlerPath}.addFreelancerReward`,
  events: [
    {
      http: {
        method: "post",
        path: `${addFreelancerRewardRoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export { getRewardHistory, addFreelancerReward, getAggregatedRewards };
