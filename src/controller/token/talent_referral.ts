import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import {
  sendEmail,
  talentReferralHistoryService,
  talentReferralService,
  userService,
} from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getReferralEmail } from "@utils/email";
import { getFrontendWebsiteUrl } from "@config";

const sendInviteEmail = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "sendInviteEmail";
      const input: any = JSON.parse(event.body);

      const { user_id, emailList } = input;

      if (user_id === undefined) {
        throw new Error(`${functionName}: user_id should be provided`);
      }

      if (emailList === undefined) {
        throw new Error(`${functionName}: emailList should be provided`);
      }

      const referral = await talentReferralService.getOneByUserId(user_id);
      if (referral === null) {
        const user = await userService.getOneByUserId(user_id);
        const referral = await talentReferralService.createAndGenerateCode({
          user_id,
          email: user?.email_id,
        });
        if (referral === undefined) {
          throw new Error(`Error occured: cannot find referral`);
        }
      }

      const { id } = await talentReferralService.getOneByUserId(user_id);
      const { User } = await talentReferralService.getUserInfoByUserId(user_id);
      const referrer = User?.first_name + " " + User?.last_name;

      emailList.map(async (email) => {
        await talentReferralHistoryService.createOrUpdate({
          email,
          referral_id: id,
          user_id,
        });
      });

      const emailContent = getReferralEmail(
        referrer,
        `${getFrontendWebsiteUrl()}/signup?referral_code=${referral?.referral_code}`,
      );
      await sendEmail(emailContent, emailList);

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { sendInviteEmail };
