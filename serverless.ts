import type { AWS } from "@serverless/typescript";
import { getStage, getNodeEnv, getRegion, bucketName, SENTRY_DSN, stackName } from "@config";
import { cognito, ResumeBucket, UploadRole } from "@resource";
import * as routers from "@router";

const getRouters = () => {
  const keys = Object.keys(routers);
  let i = 0;
  for (; i < keys.length; i++) {
    routers[keys[i]].permission = undefined;
  }

  return routers;
};

const serverlessConfiguration: AWS = {
  service: stackName,
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-plugin-split-stacks",
    "serverless-sentry",
  ],
  provider: {
    name: "aws",
    stage: getStage(),
    region: getRegion(),
    runtime: "nodejs16.x",
    timeout: 900,
    versionFunctions: false,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      binaryMediaTypes: ["multipart/form-data"],
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      NODE_ENV: getNodeEnv(),
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["s3:*"],
            Resource: [`arn:aws:s3:::${bucketName}`, `arn:aws:s3:::${bucketName}/*`],
          },
          {
            Effect: "Allow",
            Action: ["ses:*"],
            Resource: [`*`],
          },
          {
            Effect: "Allow",
            Action: ["lambda:InvokeAsync", "lambda:InvokeFunction"],
            Resource: "*",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: getRouters(),
  package: { individually: true },
  custom: {
    "serverless-offline": {
      allowCache: true, // Important: This will prevent serverless-offline from eating all of your memory
      useChildProcesses: true,
      useSeparateProcesses: true,
      host: "0.0.0.0",
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node16",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    "s3-sync": [
      {
        folder: "resumes",
        bucket: bucketName,
      },
    ],
    splitStacks: {
      perFunction: false,
      perType: false,
      perGroupFunction: true,
      nestedStackCount: 15,
    },
    sentry: {
      dsn: SENTRY_DSN,
      organization: "Outdefine",
      project: "Outdefine-backend",
      filterLocal: false,
    },
  },
  resources: {
    Resources: {
      // IAM Roles
      UploadRole,
      // S3 Bucket
      ResumeBucket,
      // Cognito
      CognitoUserPool: cognito.CognitoUserPool,
      CognitoPoolClient: cognito.CognitoPoolClient,
      CognitoIdentityPool: cognito.CognitoIdentityPool,
      CognitoIdentityPoolRoles: cognito.CognitoIdentityPoolRoles,
      CognitoAuthRole: cognito.CognitoAuthRole,
      ApiGatewayAuthorizer: cognito.ApiGatewayAuthorizer,
      GatewayResponseDefault: cognito.GatewayResponseDefault,
    },
    Outputs: {
      // cognito outputs
      OutdefApiGatewayRestApiId: cognito.OutdefApiGatewayRestApiId,
      ApiGatewayAuthorizerId: cognito.ApiGatewayAuthorizerId,
    },
  },
};

module.exports = serverlessConfiguration;
