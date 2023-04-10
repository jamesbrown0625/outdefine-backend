import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { formatJSONResponse, middyfyForFreelancer } from "@libs";

const sendEmailLambda = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const emailId = event.pathParameters.email_id;
      if (emailId === undefined) {
        throw new Error("Email is not provided");
      }

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

export { sendEmailLambda };
