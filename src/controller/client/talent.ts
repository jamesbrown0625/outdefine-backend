import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { freelancerProfileService } from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/**
 * Get company detail
 * @params id: number
 */
const getFilteredTalents = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const arg = event.queryStringParameters;

      if (arg.skip === undefined || arg.limit === undefined) {
        throw new Error("offset and limit is not provided");
      }

      const data = await freelancerProfileService.filter(arg);

      return formatJSONResponse({ success: true, data });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { getFilteredTalents };
