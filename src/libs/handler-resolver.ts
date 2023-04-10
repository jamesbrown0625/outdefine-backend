import { APIGatewayProxyEvent } from "aws-lambda";

export const handlerPath = (context: string) => {
  return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, "/")}`;
};

export const getUserFromContext = (event: APIGatewayProxyEvent) => {
  return JSON.parse(event.requestContext.authorizer.user);
};
