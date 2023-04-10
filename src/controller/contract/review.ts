import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { formatJSONResponse, middyfyForFreelancer } from "@libs";
import { reviewService } from "@service";

const getAllReviews = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const direction = event.pathParameters.direction;

      if (direction !== "C2F" && direction !== "F2C") {
        throw new Error("Request format is invalid, use C2F or F2C for direction");
      }

      const reviews = await reviewService.getAllByDirection(direction);

      return formatJSONResponse({
        success: true,
        data: reviews,
      });
    } catch (e) {
      return formatJSONResponse({
        status: 500,
        message: `Error Occurred: ${e.message}`,
      });
    }
  },
);

const getAllReviewsForACompany = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const company_id = event.pathParameters.company_id;
      if (company_id === undefined) {
        throw new Error("Company id is missing in the request");
      }

      const companyReviews = reviewService.getAllReviewsForACompany(Number(company_id));

      return formatJSONResponse({
        success: true,
        data: companyReviews,
      });
    } catch (e) {
      return formatJSONResponse({
        status: 500,
        message: `Error Occurred: ${e.message}`,
      });
    }
  },
);

const getAllReviewsForAFreelancer = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const freelancer_id = event.pathParameters.freelancer_id;
      if (freelancer_id === undefined) {
        throw new Error("Freelancer id is missing in the request");
      }

      const freelancerReviews = reviewService.getAllReviewsForAFreelancer(Number(freelancer_id));

      return formatJSONResponse({
        success: true,
        data: freelancerReviews,
      });
    } catch (e) {
      return formatJSONResponse({
        status: 500,
        message: `Error Occurred: ${e.message}`,
      });
    }
  },
);

const leaveAReviewForAFreelancer = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);

      const { freelancer_id, contract_id, company_id, rating } = input;

      if (
        freelancer_id === undefined ||
        company_id === undefined ||
        contract_id === undefined ||
        rating === undefined
      ) {
        throw new Error("Some fields are missing in the body");
      }

      const existence = await reviewService.checkReviewExistence(
        company_id,
        freelancer_id,
        contract_id,
        "C2F",
      );

      if (existence) {
        throw new Error("Already left a review");
      }

      await reviewService.leaveAReviewForAFreelancer(input);

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

const leaveAReviewForACompany = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);

      const { freelancer_id, company_id, contract_id, rating } = input;

      if (
        freelancer_id === undefined ||
        company_id === undefined ||
        contract_id === undefined ||
        rating === undefined
      ) {
        throw new Error("Some fields are missing in the body");
      }

      const existence = await reviewService.checkReviewExistence(
        company_id,
        freelancer_id,
        contract_id,
        "F2C",
      );

      if (existence) {
        throw new Error("Already left a review");
      }

      await reviewService.leaveAReviewForACompany(input);

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

export {
  getAllReviews,
  getAllReviewsForACompany,
  getAllReviewsForAFreelancer,
  leaveAReviewForAFreelancer,
  leaveAReviewForACompany,
};
