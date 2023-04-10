import { APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse, middyfyForFreelancer } from "@libs";

const testSentryException = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  return formatJSONResponse({
    status: 500,
    message: "Error Occurred: sentry exception testing",
  });
});

const testSentrySuccess = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  return formatJSONResponse({
    data: "success",
  });
});

export { testSentryException, testSentrySuccess };
