import { getStage, isInDevelopment } from "./stage";

// Cognito Names
const userPoolName = `${getStage()}-outdefine-users3`;
const userPoolClientApp = `${getStage()}-outdefine-client-app3`;
const IdentityPoolName = `${getStage()}-outdefine-identities3`;
const authorizerName = `${getStage()}-outdefine-Authorizer3`;
const apiGatewayName = `${getStage()}-outdefine-RestGateway3`;
const apiAuthorizerName = `${getStage()}-piGatewayAuthorizerId3`;
const stackName = isInDevelopment() ? `outdefine-stack-2` : `${getStage()}-outdefine-stack`;

// S3 Name
const bucketName = `${getStage()}-outdefine-resume`;

export {
  userPoolName,
  userPoolClientApp,
  IdentityPoolName,
  authorizerName,
  apiGatewayName,
  apiAuthorizerName,
  bucketName,
  stackName,
};
