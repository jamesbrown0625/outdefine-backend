import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { walletService } from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const getBalanceByUserId = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "getBalanceByUserId";
      const user_id = event.queryStringParameters.user_id;

      if (user_id === undefined) {
        throw new Error(`${functionName}: user_id should be provided`);
      }

      const balance = await walletService.getBalance(user_id);

      return formatJSONResponse({
        status: 200,
        data: {
          balance,
        },
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const withdrawBalanceByUserId = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "withdrawBalanceByUserId";
      const input = JSON.parse(event.body);
      const { user_id, amount = 0 } = input;

      if (user_id === undefined) {
        throw new Error(`${functionName}: user_id should be provided`);
      }

      const balance = await walletService.withdraw({
        user_id,
        amount,
      });

      return formatJSONResponse({
        success: balance,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { getBalanceByUserId, withdrawBalanceByUserId };
