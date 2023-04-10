import * as AWS from "aws-sdk";

require("dotenv").config();

const DEV_REGION = "us-west-1";
const PROD_REGION = "us-east-1";
const accountId = "200003059020";

const AWS_KEY = process.env.AWS_KEY;
const AWS_SECRET = process.env.AWS_SECRET;

const isInDevelopment = () => {
  if (process.env.NODE_ENV == "production") return false;
  return true;
};

const getNodeEnv = () => {
  return process.env.NODE_ENV;
};

const getRegion = () => {
  if (isInDevelopment()) {
    return DEV_REGION;
  }
  return PROD_REGION;
};

const getFrontendWebsiteUrl = () => {
  if (isInDevelopment()) {
    return "https://www.app-dev1.outdefine.com";
  }
  return "https://www.app.outdefine.com";
};

AWS.config.update({
  accessKeyId: AWS_KEY,
  secretAccessKey: AWS_SECRET,
  region: getRegion(),
});

const s3 = new AWS.S3();
const cognitoIdp = new AWS.CognitoIdentityServiceProvider();

export const getSES = () => {
  return new AWS.SES({ region: getRegion() });
};

export const getSESV2 = () => {
  return new AWS.SESV2();
};

const getStage = () => {
  return isInDevelopment() ? "dev" : "prod";
};

const isLocalEnvironment = () => {
  if (process.env.NODE_ENV === "local") {
    return true;
  }

  return false;
};

const getLambda = () => {
  if (isLocalEnvironment()) {
    return new AWS.Lambda({
      region: getRegion(),
      apiVersion: "2015-03-31",
      endpoint: "http://localhost:3002",
    });
  }

  return new AWS.Lambda({
    region: getRegion(),
    apiVersion: "2015-03-31",
  });
};

export {
  accountId,
  s3,
  cognitoIdp,
  AWS_KEY,
  AWS_SECRET,
  getRegion,
  getLambda,
  isInDevelopment,
  getStage,
  getNodeEnv,
  getFrontendWebsiteUrl,
  isLocalEnvironment,
};
