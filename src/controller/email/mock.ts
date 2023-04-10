import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { formatJSONResponse, middyfyForFreelancer } from "@libs";
import { createContactList, sendEmail } from "@service";
import {
  getAssessmentBehavioralConfirmEmail,
  getAssessmentBehavioralInviteEmail,
  getAssessmentFailedEmail,
  getAssessmentInviteBackEmail,
  getAssessmentOneMoreAttemptEmail,
  getAssessmentPassedEmail,
  getAssessmentReminderEmail,
  getAssessmentRoleConfirmEmail,
  getCompanyInviteMemberEmail,
  getCompanyVerifyAccountEmail,
  getCompanyWelcomeEmail,
  getRecommendedCandidatesEmail,
  getReferalPassedAssessmentEmail,
  getReferralEmail,
} from "@utils/email";

const sendEmailLambda = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const { emailId } = JSON.parse(event.body);

      // Send Email to the talent
      // const emailContent = getWelcomeEmail("https://mock.com");

      const email1 = getAssessmentRoleConfirmEmail(
        "aaron",
        `
            frontend developer
          `,
        "https://dfw.com",
      );

      const email2 = getAssessmentReminderEmail("aaron", "https://dfw.com");
      const email3 = getAssessmentPassedEmail("aaron", "https://dfw.com");
      const email4 = getAssessmentOneMoreAttemptEmail("https://dfw.com");
      const email5 = getAssessmentFailedEmail("https://dfw.com");
      const email6 = getAssessmentInviteBackEmail("https://dfw.com");
      const email7 = getAssessmentBehavioralInviteEmail("https://dfw.com");
      const email8 = getAssessmentBehavioralConfirmEmail("8/2/22  @2:00pm PST", "https://dfw.com");

      const referal1 = getReferralEmail("Sierra", "https://dfw.com");
      const referal2 = getReferalPassedAssessmentEmail("Aaron", "Sierra", "https://dfw.com");

      const company1 = getCompanyWelcomeEmail("https://dfw.com");
      const company2 = getCompanyVerifyAccountEmail("Sierra", "123456");
      const company3 = getCompanyInviteMemberEmail("Outdefine", "Sierra", "https://dfw.com");
      const company4 = getRecommendedCandidatesEmail("https://dfw.com");

      await sendEmail(email1, [emailId]);
      await sendEmail(email2, [emailId]);
      await sendEmail(email3, [emailId]);
      await sendEmail(email4, [emailId]);
      await sendEmail(email5, [emailId]);
      await sendEmail(email6, [emailId]);
      await sendEmail(email7, [emailId]);
      await sendEmail(email8, [emailId]);

      await sendEmail(referal1, [emailId]);
      await sendEmail(referal2, [emailId]);

      await sendEmail(company1, [emailId]);
      await sendEmail(company2, [emailId]);
      await sendEmail(company3, [emailId]);
      await sendEmail(company4, [emailId]);

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatJSONResponse({
        status: 500,
        message: `Error Occurred: ${e.message}`,
      });
    }
  },
);

const createContactListLambda = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  try {
    await createContactList("outdefineContactList");

    return formatJSONResponse({
      success: true,
    });
  } catch (e) {
    return formatJSONResponse({
      status: 500,
      message: `Error Occurred: ${e.message}`,
    });
  }
});

export { sendEmailLambda, createContactListLambda };
