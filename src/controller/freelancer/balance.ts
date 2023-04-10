import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { freelanceBalanceService } from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const getFreelanceBalance = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "getFreelanceBalance";
      const freelancerId = event.pathParameters.id;

      if (freelancerId === undefined) {
        throw new Error(`${functionName}: freelancer_id should be provided`);
      }

      const balance = await freelanceBalanceService.getFreelancerBalance(Number(freelancerId));

      return formatJSONResponse({
        status: 200,
        balance,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const saveFreelanceBalance = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "saveFreelanceBalance";
      const input = JSON.parse(event.body);
      const freelancerId = input.freelancer_id;
      const balance = input.balance;

      if (freelancerId === undefined) {
        throw new Error(`${functionName}: freelancer_id should be provided`);
      }

      const freelancerBalance = await freelanceBalanceService.createOrUpdate({
        freelancer_id: freelancerId,
        balance,
      });

      return formatJSONResponse({
        success: true,
        freelancerBalance,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { getFreelanceBalance, saveFreelanceBalance };
