import { getFrontendWebsiteUrl } from "@config";
import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { clientProfileService, companyService, sendEmail, userService } from "@service";
import { getCompanyInviteMemberEmail, getCompanyWelcomeEmail } from "@utils/email";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/**
 * Join the invited client to the company
 * @params company_name: string
 * @params first_name: string
 * @params last_name: string
 * @params email: string
 */
const joinCompany = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const companyName = input.company_name;
      const firstName = input.first_name;
      const lastName = input.last_name;
      const email = input.email;

      if (companyName === undefined) throw new Error("Company name is not provided");
      if (firstName === undefined) throw new Error("First name is not provided");
      if (lastName === undefined) throw new Error("Last name is not provided");
      if (email === undefined) throw new Error("Email is not provided");

      let company = await companyService.getOneByName(companyName);

      if (company === null) {
        company = await companyService.create({
          name: companyName,
        });
      }

      let user = await userService.getOneByEmail(email);
      if (user === null) {
        user = await userService.create({
          first_name: firstName,
          last_name: lastName,
          email_id: email,
          user_type: "CLIENT",
        });
      } else {
        await userService.update({
          email_id: email,
          user_type: "CLIENT",
        });
      }

      await clientProfileService.createOrUpdate({
        client_id: user.user_id,
        company_id: company.company_id,
      });

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Update client profile
 * @params client_id: number
 * @params first_name: string
 * @params last_name: string
 * @params email: string
 * @params position: string
 * @params avatar: string
 */
const updateClientProfile = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const clientId = input.client_id;
      const firstName = input.first_name;
      const lastName = input.last_name;
      const email = input.email;
      const position = input.position;
      const avatar = input.avatar;
      const background_number = input.background_number;
      const summary = input.summary;

      if (clientId === undefined) throw new Error("Client Id is not provided");
      if (firstName === undefined) throw new Error("First name is not provided");
      if (lastName === undefined) throw new Error("Last name is not provided");
      if (email === undefined) throw new Error("Email is not provided");
      if (position === undefined) throw new Error("position is not provided");
      if (avatar === undefined) throw new Error("Avatar is not provided");

      await userService.updateById({
        user_id: clientId,
        first_name: firstName,
        last_name: lastName,
        email_id: email,
        user_type: "CLIENT",
        avatar,
        background_number,
      });

      await clientProfileService.update({
        client_id: clientId,
        position,
        summary,
      });

      const profile = await clientProfileService.getOneByClientId(parseInt(clientId));

      return formatJSONResponse({
        success: true,
        profile,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Update client profile
 * @params client_id: string
 * @params first_name: string
 * @params last_name: string
 * @params email: string
 * @params position: string
 */
const updateTeamMember = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const clientId = input.client_id;
      const firstName = input.first_name;
      const lastName = input.last_name;
      const email = input.email;
      const position = input.position;

      if (clientId === undefined) throw new Error("Client Id is not provided");
      if (firstName === undefined) throw new Error("First name is not provided");
      if (lastName === undefined) throw new Error("Last name is not provided");
      if (email === undefined) throw new Error("Email is not provided");
      if (position === undefined) throw new Error("position is not provided");

      const user = await userService.getOneByUserId(clientId);
      if (user === null) throw new Error("User Id is not valid");

      await userService.updateById({
        user_id: user.user_id,
        first_name: firstName,
        last_name: lastName,
        email_id: email,
        user_type: "CLIENT",
      });

      await clientProfileService.update({
        client_id: user.user_id,
        position,
      });

      const data = await clientProfileService.getOneByClientId(parseInt(user.user_id));

      return formatJSONResponse({
        success: true,
        data,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Remove client profile
 * @params client_id: integer
 */
const removeClientProfile = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const clientId = event.pathParameters.id;

      if (clientId === undefined) throw new Error("Client ID is not provided");

      await clientProfileService.remove(parseInt(clientId));

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Update client profile
 * @params client_id: integer
 */
const getClientProfile = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const clientId = event.pathParameters.id;

      if (clientId === undefined) throw new Error("Client ID is not provided");

      const user = await userService.getOneByUserId(clientId);
      const client = await clientProfileService.getOneByClientId(parseInt(clientId));
      const company = await companyService.getOneById(client.company_id);

      return formatJSONResponse({
        success: true,
        name: `${user.first_name} ${user.last_name}`,
        profile: client,
        company,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Update client onboarding status
 * @params client_id: number
 * @params onboarding_status: string
 */
const updateOnboardingStatus = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const clientId = input.client_id;
      const onboardingStatus = input.onboarding_status;

      if (clientId === undefined) throw new Error("Client ID is not provided");
      if (onboardingStatus === undefined) throw new Error("Onboarding Status is not provided");

      const client = await clientProfileService.getOneByClientId(clientId);
      if (client === null) throw new Error("Client with the specified client id does not exist");

      await clientProfileService.update({
        client_id: clientId,
        onboarding_status: onboardingStatus,
      });

      // Send onboard completed email
      if (onboardingStatus === "COMPLETED") {
        const user = await userService.getOneByUserId(clientId);

        // Send Email to the talent
        const emailContent = getCompanyWelcomeEmail(getFrontendWebsiteUrl());
        await sendEmail(emailContent, [user.email_id]);
      }

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Invite a list of team members to the company
 * @params client_id: number
 * @params position: string
 * @params email_list: email1,email2 etc
 */
const inviteMembers = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const clientId = input.client_id;
      const position = input.position;
      const emailList = input.email_list.split(",");

      if (clientId === undefined) throw new Error("Client ID is not provided");
      if (position === undefined) throw new Error("Position is not provided");

      const client = await clientProfileService.getOneByClientId(clientId);
      if (client === null) throw new Error("Client with the specified client id does not exist");

      const company = await companyService.getOneById(client.company_id);
      if (company === null) throw new Error("Company doesn't exist");

      for (let i = 0; i < emailList.length; i++) {
        let user = await userService.getOneByEmail(emailList[i]);

        if (user === null) {
          user = await userService.create({
            email_id: emailList[i],
            user_type: "CLIENT",
          });
        }
        await clientProfileService.createOrUpdate({
          client_id: user.user_id,
          company_id: company.company_id,
          position,
          type: "invited",
          invited_by: clientId,
          date_invited: new Date(),
        });

        const referrer = await userService.getOneByUserId(clientId);

        // Send Invite Email template to the invited member
        const emailContent = getCompanyInviteMemberEmail(
          company.name,
          `${referrer.first_name} ${referrer.last_name}`,
          getFrontendWebsiteUrl(),
        );
        await sendEmail(emailContent, [emailList[i]]);
      }

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Get the list of the team members of the company
 * @params company_id: number
 */
const getTeamMembers = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const companyId = input.company_id;

      if (companyId === undefined) throw new Error("Company ID is not provided");

      let data = await clientProfileService.getAllTeamMembers(companyId);
      data = data.map((item) => ({
        client_id: item.client_id,
        company_id: item.company_id,
        company_name: item.Company.name,
        position: item.position,
        onboarding_status: item.onboarding_status,
        type: item.type,
        date_invited: item.date_invited,
        invited_by: item.invited_by,
        User: item.User,
        inviter_name: item.Inviter ? `${item.Inviter.first_name} ${item.Inviter.last_name}` : "",
      }));

      return formatJSONResponse({
        success: true,
        data,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Create a list of clients specified by email list
 * @params position: string
 * @params company_name: string
 * @params email_list: string
 */
const addClients = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const position = input.position;
      const emailList = input.email_list.split(",");
      const companyName = input.company_name;

      if (position === undefined) throw new Error("Position is not provided");
      if (companyName === undefined) throw new Error("Company Name is not provided");

      const company = await companyService.getOneByName(companyName);
      if (company === null) throw new Error("Company doesn't exist");

      for (let i = 0; i < emailList.length; i++) {
        let user = await userService.getOneByEmail(emailList[i]);

        if (user === null) {
          user = await userService.create({
            email_id: emailList[i],
            user_type: "CLIENT",
          });
        }
        await clientProfileService.update({
          client_id: user.user_id,
          company_id: company.company_id,
          position,
        });
      }

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export {
  joinCompany,
  updateClientProfile,
  addClients,
  updateOnboardingStatus,
  getClientProfile,
  inviteMembers,
  getTeamMembers,
  updateTeamMember,
  removeClientProfile,
};
