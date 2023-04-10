import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import {
  clientProfileService,
  freelancerProfileService,
  talentReferralHistoryService,
  talentReferralService,
  userService,
} from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const getReferralHistoryByReferrer = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "getReferralHistoryByReferrer";
      const user_id = event.queryStringParameters.user_id;

      if (user_id === undefined) {
        throw new Error(`${functionName}: user_id should be provided`);
      }
      const referrals = await talentReferralService.getAllByUserId(Number(user_id));
      if (!referrals || (Array.isArray(referrals) && referrals.length === 0)) {
        throw new Error(`${functionName}: No referrals`);
      }
      const { talent_referral_history } = referrals[0];
      const referralHistory = [];
      console.log({ talent_referral_history });
      for (let idx = 0; idx < talent_referral_history.length; idx++) {
        let referral_status: string;
        const { email, createdAt: referralSentAt } = talent_referral_history[idx];
        const userInfo = await userService.getOneByEmail(email);
        if (userInfo === null) {
          referralHistory.push({
            email,
            referral_status: "INVITED",
            referralSentAt,
          });
          continue;
        }
        const freelancerInfo = await freelancerProfileService.getOneById(userInfo.user_id);
        if (freelancerInfo === null) continue;
        const { is_trusted_talent: talentStatus, createdAt: joinedAt } = freelancerInfo;
        if (talentStatus === "TRUSTED") {
          referral_status = "TRUSTED";
        } else {
          referral_status = "PENDING";
        }
        referralHistory.push({
          email,
          referral_status,
          referralSentAt,
          joinedAt,
        });
      }
      return formatJSONResponse({
        status: 200,
        data: referrals,
        referralHistory,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const getPendingReferrals = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "getPendingReferrals";
      const user_id = event.queryStringParameters.user_id;

      if (user_id === undefined) {
        throw new Error(`${functionName}: user_id should be provided`);
      }

      const referral = await talentReferralService.getOneByUserId(Number(user_id));
      if (referral === null) {
        throw new Error(`${functionName}: No referral for the user_id`);
      }
      const referrals = await talentReferralHistoryService.getAllByReferralId(referral.id);

      return formatJSONResponse({
        status: 200,
        data: referrals,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { getReferralHistoryByReferrer, getPendingReferrals };
