import {
  PreSignUpTriggerHandler,
  PreAuthenticationTriggerHandler,
  APIGatewayProxyResult,
  PreSignUpTriggerEvent,
  PreAuthenticationTriggerEvent,
  APIGatewayProxyEvent,
  CustomMessageTriggerEvent,
  CustomMessageTriggerHandler,
} from "aws-lambda";

import {
  formatExceptionResponse,
  formatJSONResponse,
  middyfyForFreelancer,
  middyfyWithoutCors,
} from "@libs";
import {
  getUserByEmail,
  linkProviderToUser,
  userService,
  talentReferralService,
  talentReferralHistoryService,
  upload,
} from "@service";
import { IUser } from "@interface";
import { getFrontendWebsiteUrl, USER_TYPES } from "@config";
import {
  getPasswordResetEmail,
  getResendVerifyAccountEmail,
  getVerifyAccountEmail,
} from "@utils/email";

const getAll = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  try {
    const user = await userService.getAll();

    return formatJSONResponse({
      success: user,
    });
  } catch (e) {
    return formatExceptionResponse(e);
  }
});

const signUp = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "signUp";
      const input = JSON.parse(event.body);
      const { email, firstName, lastName, userType, referralCode } = input;
      const userData: IUser = {
        email_id: email,
        first_name: firstName,
        last_name: lastName,
        user_type: userType,
      };
      const existingUser = await userService.getOneByEmail(email);
      if (existingUser) {
        throw new Error(`${functionName}: User already exists`);
      }
      const { user_id: newUserId } = await userService.create(userData);

      if (referralCode) {
        const referralItem = await talentReferralService.getByReferralCode(referralCode);
        if (referralItem !== null) {
          const histories = await talentReferralHistoryService.getAllPendingsByEmail(email);
          if (histories && histories.length > 0) {
            for (const item of histories) {
              await item.update({
                ...item,
                user_id: newUserId,
                referral_id: referralItem.id,
                status: "SIGNEDUP",
              });
            }
          } else {
            await talentReferralHistoryService.create({
              user_id: newUserId,
              email,
              referral_id: referralItem.id,
              status: "SIGNEDUP",
            });
          }
        }
      }
      // create referral code for new user
      const item = await talentReferralService.createAndGenerateCode({
        user_id: newUserId,
        email,
      });
      return formatJSONResponse({
        success: item,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const customMessageTrigger: CustomMessageTriggerHandler = middyfyWithoutCors(
  async (event: CustomMessageTriggerEvent) => {
    try {
      // const email = event.request.userAttributes.email
      const link = event.request.codeParameter;
      const name =
        event.request.userAttributes.family_name + " " + event.request.userAttributes.given_name;

      if (event.triggerSource === "CustomMessage_SignUp") {
        event.response = {
          emailSubject: "Almost there! You just need to verify your account!",
          emailMessage: getVerifyAccountEmail(name, link),
          smsMessage: "",
        };
      } else if (event.triggerSource === "CustomMessage_ResendCode") {
        event.response = {
          emailSubject: "Almost there! You just need to verify your account!",
          emailMessage: getResendVerifyAccountEmail(link),
          smsMessage: "",
        };
        // } else if (event.triggerSource === 'CustomMessage_AdminCreateUser') {
        //   event.response = {
        //     emailSubject: 'Publish | Your temporary account details',
        //     emailMessage: templateInvite(
        //       name,
        //       event.request.usernameParameter,
        //       event.request.codeParameter,
        //     ),
        //   }
      } else if (event.triggerSource === "CustomMessage_ForgotPassword") {
        event.response = {
          emailSubject: "Reset your Outdefine password",
          emailMessage: getPasswordResetEmail(`${getFrontendWebsiteUrl()}/forgotPassword`),
          smsMessage: "",
        };
      }

      return event;
    } catch (error) {
      console.log("Pre-Signup: Error occured", error);
      return event;
    }
  },
);

const createUserAfterSignUp: PreSignUpTriggerHandler = middyfyWithoutCors(
  async (event: PreSignUpTriggerEvent) => {
    try {
      if (event.triggerSource === "PreSignUp_ExternalProvider") {
        const userRs = await getUserByEmail(event.userPoolId, event.request.userAttributes.email);
        event.response.autoConfirmUser = true;
        event.response.autoVerifyEmail = true;
        console.log("Pre-Signup: ", event);
        if (userRs && userRs.Users.length > 0) {
          const [providerName, providerUserId] = event.userName.split("_");
          await linkProviderToUser(
            userRs.Users[0].Username,
            event.userPoolId,
            providerName,
            providerUserId,
          );
        } else {
          const { email, firstName = "", lastName = "" } = event.request.userAttributes;
          const userData: IUser = {
            email_id: email,
            first_name: firstName,
            last_name: lastName,
            user_type: USER_TYPES[0],
          };
          const existingUser = await userService.getOneByEmail(email);
          if (existingUser) {
            throw new Error(`Pre-Signup: User already exists`);
          }
          await userService.create(userData);
          console.log("Pre-Signup: User created");
        }
      }
      return event;
    } catch (error) {
      console.log("Pre-Signup: Error occured", error);
      return event;
    }
  },
);

const preAuthenticationTrigger: PreAuthenticationTriggerHandler = middyfyWithoutCors(
  async (event: PreAuthenticationTriggerEvent) => {
    console.log("Pre-Auth: ", event);
    return event;
  },
);

/**
 * @params email_id : string
 * @params first_name: string
 * @params last_name: string
 * @params contact_number: string
 * @params user_type: string
 * @params referral_link: string
 * @params referred_id: number
 * @params is_deleted: boolean
 * @params avatar: string
 * @params avatar_number: number
 * @params avatar_type: boolean
 * @params banner: string
 * @params banner_number: number
 * @params banner_type: boolean
 * @params background_number: boolean
 * @params pronoun: number
 */
const updateUser = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input: IUser = JSON.parse(event.body);
      if (input.email_id === undefined) {
        throw new Error("Email is not provided");
      }

      await userService.update(input);

      const updated_user = await userService.getOneByEmail(input.email_id);

      return formatJSONResponse({
        success: true,
        data: updated_user,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const createUser = middyfyForFreelancer(async (event: APIGatewayProxyEvent) => {
  try {
    const input: IUser = JSON.parse(event.body);
    await userService.create(input);
    return formatJSONResponse({
      success: true,
    });
  } catch (e) {
    return formatExceptionResponse(e);
  }
});

const getUser = middyfyForFreelancer(async (event: APIGatewayProxyEvent) => {
  try {
    const emailId = event.pathParameters.email_id;
    if (emailId === undefined) {
      throw new Error("Email is not provided");
    }

    const user = await userService.getOneByEmail(emailId);
    if (user === null) {
      return formatJSONResponse({
        success: false,
        message: `Error Occurred: User Doesn't exist`,
      });
    }

    return formatJSONResponse({
      success: true,
      data: user,
    });
  } catch (e) {
    return formatExceptionResponse(e);
  }
});

const updateUserAvatar = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const emailId = event.pathParameters.email_id;

      if (emailId === undefined) {
        throw new Error("Email is not provided");
      }

      const user = await userService.getOneByEmail(emailId);
      if (user === null) {
        throw new Error(`User doesn't exist`);
      }

      // Upload file to S3 and get the link
      const link = await upload(event);
      await userService.update({
        email_id: user.email_id,
        avatar: link,
      });
      const updatedData = await userService.getOne(user.user_id);

      return formatJSONResponse({
        success: true,
        data: updatedData,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const updateUserBanner = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const emailId = event.pathParameters.email_id;

      if (emailId === undefined) {
        throw new Error("Email is not provided");
      }

      const user = await userService.getOneByEmail(emailId);
      if (user === null) {
        throw new Error(`User doesn't exist`);
      }

      // Upload file to S3 and get the link
      const link = await upload(event);
      await userService.update({
        email_id: user.email_id,
        banner: link,
      });
      const updatedData = await userService.getOne(user.user_id);

      return formatJSONResponse({
        success: true,
        data: updatedData,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export {
  getAll,
  signUp,
  createUser,
  updateUser,
  createUserAfterSignUp,
  preAuthenticationTrigger,
  getUser,
  updateUserAvatar,
  updateUserBanner,
  customMessageTrigger,
};
