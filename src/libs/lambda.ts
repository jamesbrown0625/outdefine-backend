import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import cors from "@middy/http-cors";
import { getUserByToken, userService } from "@service";
import { formatJSONResponse } from "./api-gateway";
import withSentry from "serverless-sentry-lib";

// Wrap handler for automated error and exception logging
const withSentryOptions = {
  captureErrors: false,
  captureUnhandledRejections: true,
  captureUncaughtException: true,
  captureMemory: true,
  captureTimeouts: true,
};

const middyfyWithoutCors = (handler) => {
  const middyFunc = middy(handler);
  middyFunc.use(middyJsonBodyParser());
  // middyFunc.use(
  //   sentryErrorHandler({
  //     dsn: 'https://1ce1ee7cd6034188abf71099550792e1@o4503967076450304.ingest.sentry.io/4504000186613760',
  //   }),
  // )

  return middyFunc;
};

const middyfyWithCors = (handler) => {
  const middyFunc = middyfyWithoutCors(handler);

  try {
    middyFunc.use(
      cors({
        origin: "*",
        credentials: false,
      }),
    );
  } catch (e) {
    // console.log(`Error Occurred: Cors Middleware couldn't be set up`)
  }

  return middyFunc;
};

const getToken = (event: any) => {
  return event.headers?.Authorization; // | event.headers.authorization
};

const addUserToEventBodyMiddleware = (): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
    handler,
  ) => {
    try {
      const token = getToken(handler.event);
      let user = await getUserByToken(token);

      if (user === null) {
        throw new Error("Token is not authorized");
      }
      const email = user.UserAttributes[2].Value;
      user = await userService.getOneByEmail(email);

      let eventBody = JSON.parse(handler.event.body);
      eventBody = { ...eventBody, user };
      handler.event.body = JSON.stringify(eventBody);
    } catch (e) {
      return formatJSONResponse({
        status: 500,
        message: `Error Occurred: ${e.message}`,
      });
    }
  };

  return {
    before,
  };
};

const freelancerAuthorizerMiddleware = (): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
    handler,
  ) => {
    try {
      console.log("Request", handler.event);
      const eventBody = JSON.parse(handler.event.body);
      if (eventBody.user.user_type !== "FREELANCER") { throw new Error("Only freelancers are authorized to call this api"); }
    } catch (e) {
      return formatJSONResponse({
        status: 500,
        message: `Error Occurred: ${e.message}`,
      });
    }
  };

  return {
    before,
  };
};
const middyfyForFreelancerWithoutSentry = (handler) => {
  const middyFunc = middyfyWithCors(handler);
  return middyFunc;
};

const middyfyForInvokedFunctions = (handler) =>
  withSentry(withSentryOptions, middyfyWithoutCors(handler));

const middyfyForFreelancer = (handler) =>
  withSentry(withSentryOptions, middyfyForFreelancerWithoutSentry(handler));

export { middyfyWithoutCors, middyfyForFreelancer, middyfyForInvokedFunctions, getToken };
