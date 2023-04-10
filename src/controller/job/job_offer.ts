import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import {
  clientProfileService,
  companyService,
  jobApplicationService,
  jobContractService,
  jobInvitationService,
  jobOfferService,
  jobPostService,
  sendEmail,
  sendEmailV1,
  userService,
  walletService,
} from "@service";
import { ENUM_CONTRACT_STATUS, ENUM_OFFER_WITHDRAW_REASON } from "@config";
import {
  getOfferAcceptAlertEmail,
  getOfferAlertMail,
  getTalentAcceptOfferAlertEmail,
} from "@utils/email";

const getOffersById = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const id = event.pathParameters.id;
      const from = event.pathParameters.from;

      if (from === undefined || id === undefined) {
        throw new Error("Request format is invalid");
      }

      if (!["freelancer", "client"].includes(from)) {
        throw new Error("From type is invalid");
      }

      const offers = await jobOfferService.getOffersById(from, parseInt(id));

      return formatJSONResponse({
        success: true,
        offers,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const makeAnOffer = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const offer = JSON.parse(event.body);

      const { freelancer_id, company_id, job_id, application_id } = offer;

      if (!freelancer_id) {
        throw new Error("Freelancer id is needed");
      }

      if (!company_id) {
        throw new Error("Company id is needed");
      }

      if (!job_id) {
        throw new Error("Job id is needed");
      }

      if (!application_id) {
        throw new Error("Application id is needed");
      }

      const posting = await jobPostService.getOneById(job_id);

      const new_offer = await jobOfferService.create({
        ...offer,
        description: posting.description,
        primary_skills: posting.primary_skills,
        secondary_skills: posting.secondary_skills,
        duties: posting.duties,
        requirements: posting.looking_for_description,
        offered_date: new Date(),
        offer_status: "OFFERED",
      });

      const company = await companyService.getOneById(company_id);
      const talent = await userService.getOne(freelancer_id);

      const emailData = getOfferAlertMail({
        companyName: company.name,
        jobTitle: offer.position,
        userName: `${talent.first_name} ${talent.last_name}`,
      });

      await sendEmailV1(emailData, [talent.email_id], ["romil@outdefine.com"]);

      // await jobInvitationService.remove(job_id, company_id, freelancer_id);

      // await jobApplicationService.removeByPK(application_id);
      await jobApplicationService.updateToArchived(application_id);
      return formatJSONResponse({
        success: true,
        offer: new_offer,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const withdrawAnOffer = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const offer = JSON.parse(event.body);

      const { id, company_id, withdraw_reason } = offer;

      if (!id) {
        throw new Error("Offer id is needed");
      }

      if (!company_id) {
        throw new Error("Company id is needed");
      }

      if (!withdraw_reason) {
        throw new Error("Withdraw reason is needed");
      }

      if (!ENUM_OFFER_WITHDRAW_REASON.includes(withdraw_reason)) {
        throw new Error("Withdarw reason type is invalid");
      }

      await jobOfferService.withdraw(id, company_id, withdraw_reason);

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const createDummyOffers = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  await jobOfferService.fillMockData();

  return formatJSONResponse({
    success: true,
  });
});

// For Talents

const addressAnOffer = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);

      const { id, company_id, freelancer_id, method } = input;

      if (!["ACCEPTED", "DECLINED"].includes(method)) {
        throw new Error("Method is not valid");
      }

      const offer = await jobOfferService.addressAnOffer(id, company_id, freelancer_id, method);

      if (offer.offer_status === "ACCEPTED") {
        const {
          id,
          company_id,
          freelancer_id,
          position,
          experience_level,
          hourly_rate,
          term_of_hours,
          term_of_hours_duration,
          location,
          pay_frequency,
          timezone,
          contract_start,
          contract_end,
          is_ongoing,
          duties,
          primary_skills,
          secondary_skills,
          term,
        } = offer;

        const createdContract = await jobContractService.create({
          offer_id: id,
          company_id,
          freelancer_id,
          experience_level,
          position,
          hourly_rate,
          term_of_hours,
          term_of_hours_duration,
          location,
          pay_frequency,
          timezone,
          contract_start,
          contract_end,
          is_ongoing,
          duties,
          primary_skills,
          secondary_skills,
          contract_status: ENUM_CONTRACT_STATUS[0],
          term,
        });

        if (createdContract) {
          const tokenAmountWhenAcceptOffer = 250;
          await walletService.deposit({
            user_id: freelancer_id,
            amount: tokenAmountWhenAcceptOffer,
          });
        }

        // send email

        const company = await companyService.getOneById(company_id);
        const admin = await userService.getOne(offer.client_id);
        const talent = await userService.getOne(freelancer_id);

        const eamilData = getOfferAcceptAlertEmail({
          companyName: company.name,
          jobTitle: createdContract.position,
          rate: createdContract.hourly_rate,
          userName: `${talent.first_name} ${talent.last_name}`,
          contractStart: createdContract.contract_start,
          contractEnd: createdContract.is_ongoing ? "Ongoing" : createdContract.contract_end,
        });

        await sendEmailV1(eamilData, [talent.email_id], ["romil@outdefine.com"]);

        const mailData = getTalentAcceptOfferAlertEmail({
          jobTitle: createdContract.position,
          userName: `${talent.first_name} ${talent.last_name}`,
        });
        await sendEmailV1(mailData, [admin.email_id], ["romil@outdefine.com"]);
        return formatJSONResponse({
          success: true,
          company_id,
          freelancer_id,
          position,
          hourly_rate,
          term_of_hours,
          term_of_hours_duration,
          location,
          pay_frequency,
          timezone,
          contract_start,
          contract_end,
          is_ongoing,
          duties,
          primary_skills,
          secondary_skills,
          tempForEmail: company,
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

export { getOffersById, makeAnOffer, withdrawAnOffer, addressAnOffer, createDummyOffers };
