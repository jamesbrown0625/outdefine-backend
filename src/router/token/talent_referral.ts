import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("token/talent_referral");
const talentReferralHistoryHandlerPath = getHandlerPath("token/talent_referral_history");
const sendEmailRoutePath = getRoutePath("token/inviteFriends");
const getReferralsRoutePath = getRoutePath("token/getReferrals");

const sendInviteEmail = {
  handler: `${handlerPath}.sendInviteEmail`,
  events: [
    {
      http: {
        method: "post",
        path: `${sendEmailRoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getReferrals = {
  handler: `${talentReferralHistoryHandlerPath}.getReferralHistoryByReferrer`,
  events: [
    {
      http: {
        method: "get",
        path: `${getReferralsRoutePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export { sendInviteEmail, getReferrals };
