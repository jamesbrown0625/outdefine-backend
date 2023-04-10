import { IFreelancerProfilePortfolio } from "@interface";
import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import {
  freelancerProfilePortfolioService,
  freelancerProfileService,
  upload,
  userService,
} from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/**
 * @params email_id : string
 * @params portfolios: Array<IFreelancerProfilePortfolio>
 */
const createFreelancerProfilePortfolio = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const emailId = input.email_id;
      const portfolios: Array<IFreelancerProfilePortfolio> = input.portfolios;

      if (emailId === undefined) {
        throw new Error("Email is not provided");
      }
      if (portfolios === undefined) {
        throw new Error("Experience parameter is not provided");
      }

      const user = await userService.getOneByEmail(emailId);
      if (user === null) {
        throw new Error(`User doesn't exist`);
      }

      const freelancerProfile = await freelancerProfileService.createOrGetOne(user.user_id);
      if (freelancerProfile === null) {
        throw new Error("Freelancer Profile is undefined");
      }

      // Create Freelancer Profile Experience
      await freelancerProfileService.addFreelancerProfilePortfolios(freelancerProfile, portfolios);

      const updated_portfolios = await freelancerProfilePortfolioService.getByFreelancerId(
        user.user_id,
      );

      return formatJSONResponse({
        success: true,
        data: updated_portfolios,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const updateFreelancerPortfolio = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input: IFreelancerProfilePortfolio = JSON.parse(event.body);
      await freelancerProfilePortfolioService.update(input);
      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const updateFreelancerPortfolioBatch = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input: Array<IFreelancerProfilePortfolio> = JSON.parse(event.body);

      for (let i = 0; i < input.length; i++) {
        await freelancerProfilePortfolioService.update(input[i]);
      }

      const portfolios = await freelancerProfilePortfolioService.getByFreelancerId(
        input[0].freelancer_id,
      );

      return formatJSONResponse({
        success: true,
        data: portfolios,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const uploadPortfolioCoverImage = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      // Upload file to S3 and get the link
      const link = await upload(event);

      return formatJSONResponse({
        success: true,
        s3_link: link,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * @params Array<number>
 */
const removeFreelancerProfilePortfolioBatch = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input: { freelancer_id: number; data: Array<number> } = JSON.parse(event.body);

      const { freelancer_id, data } = input;

      if (freelancer_id === undefined) {
        throw new Error("Freelancer id is not provided");
      }

      if (data === undefined) {
        throw new Error("Array of id to remove is not provided");
      }

      for (let i = 0; i < data.length; i++) {
        await freelancerProfilePortfolioService.secureRemoveById(freelancer_id, data[i]);
      }

      const portfolios = await freelancerProfilePortfolioService.getByFreelancerId(freelancer_id);

      return formatJSONResponse({
        success: true,
        data: portfolios,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);
export {
  createFreelancerProfilePortfolio,
  updateFreelancerPortfolio,
  uploadPortfolioCoverImage,
  updateFreelancerPortfolioBatch,
  removeFreelancerProfilePortfolioBatch,
};
