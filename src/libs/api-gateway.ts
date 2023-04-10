import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";
import * as Sentry from "@sentry/node";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>

export const formatJSONResponse = (response: Record<string, unknown>) => {
  if (response.message !== undefined && response.message !== "") {
    Sentry.captureMessage(`Error Message: "${response.message}"`, {
      level: "info",
    });
  }

  const responseObject = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": false,
    },
    body: JSON.stringify(response),
  };

  return responseObject;
};

export const formatExceptionResponse = (e) => {
  Sentry.captureException(e);

  const responseObject = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": false,
    },
    body: JSON.stringify({
      status: 500,
      message: `Error Occurred: ${e.message}`,
    }),
  };

  return responseObject;
};

export const formatExceptionResponse2 = (e) => {
  Sentry.captureException(e);
};
