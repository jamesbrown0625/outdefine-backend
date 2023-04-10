import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { freelancerRewardService, walletService } from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import wallet from "src/model/token/wallet";

const getRewardHistoryByUserId = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "getRewardHistoryByUserId";
      const user_id = event.queryStringParameters.user_id;

      if (user_id === undefined) {
        throw new Error(`${functionName}: user_id should be provided`);
      }

      const rewards = await freelancerRewardService.getAllByUserId(Number(user_id));

      return formatJSONResponse({
        status: 200,
        data: rewards,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const getAggregatedRewards = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "getAggregatedRewards";
      const { user_id, filter = "monthly" } = event.queryStringParameters;

      if (user_id === undefined) {
        throw new Error(`${functionName}: user_id should be provided`);
      }
      const rewards = await freelancerRewardService.getAggregatedData(Number(user_id), filter);

      return formatJSONResponse({
        status: 200,
        data: rewards,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const addFreelancerReward = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "addFreelancerReward";
      const input:any = JSON.parse(event.body);
      const { user_id, status, amount = 0 } = input;

      if (user_id === undefined) {
        throw new Error(`${functionName}: user_id should be provided`);
      }

      await freelancerRewardService.create(input);

      if (status == "COMPLETED") {
        await walletService.deposit({
          user_id,
          amount,
        });
      }

      return formatJSONResponse({
        status: 200,
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { getRewardHistoryByUserId, addFreelancerReward, getAggregatedRewards };
