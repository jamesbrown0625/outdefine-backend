import {
  userPoolName,
  userPoolClientApp,
  IdentityPoolName,
  authorizerName,
  apiGatewayName,
  apiAuthorizerName,
} from "@config";

const CognitoUserPool = {
  Type: "AWS::Cognito::UserPool",
  Properties: {
    // Generate a name based on the stage
    UserPoolName: `${userPoolName}`,
    // Set email as an alias
    UsernameAttributes: ["email"],
  },
};

const CognitoPoolClient = {
  Type: "AWS::Cognito::UserPoolClient",
  Properties: {
    // Generate an app client name based on the stage
    // Generate a name based on the stage
    ClientName: userPoolClientApp,
    UserPoolId: { Ref: "CognitoUserPool" },
    ExplicitAuthFlows: ["ADMIN_NO_SRP_AUTH", "USER_PASSWORD_AUTH"],
    GenerateSecret: false,
  },
};

// The federated identity for our user pool to auth with
const CognitoIdentityPool = {
  Type: "AWS::Cognito::IdentityPool",
  Properties: {
    IdentityPoolName: `${IdentityPoolName}`,
    // Don't allow unathenticated users
    AllowUnauthenticatedIdentities: false,
    //Link to our User Pool
    CognitoIdentityProviders: [
      {
        ClientId: {
          Ref: "CognitoPoolClient",
        },
        ProviderName: { "Fn::GetAtt": ["CognitoUserPool", "ProviderName"] },
      },
    ],
  },
};

// IAM role used for authenticated users
const CognitoAuthRole = {
  Type: "AWS::IAM::Role",
  Properties: {
    Path: "/",
    AssumeRolePolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: {
            Federated: "cognito-identity.amazonaws.com",
          },
          Action: ["sts:AssumeRoleWithWebIdentity"],
          Condition: {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": {
                Ref: "CognitoIdentityPool",
              },
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "authenticated",
            },
          },
        },
      ],
    },
    Policies: [
      {
        PolicyName: "CognitoAuthorizedPolicy",
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
              Resource: [
                {
                  "Fn::Join": [
                    ":",
                    [
                      "arn:aws:logs",
                      { Ref: "AWS::Region" },
                      { Ref: "AWS::AccountId" },
                      "log-group:/aws/lambda/*:*:*",
                    ],
                  ],
                },
              ],
            },
            {
              Effect: "Allow",
              Action: ["s3:PutObject"],
              Resource: {
                "Fn::Join": ["", ["arn:aws:s3:::", { Ref: "ServerlessDeploymentBucket" }]],
              },
            },
            {
              Action: ["s3:GetObject", "s3:PutObject"],
              Resource: ["arn:aws:s3:::outdefine-applicant-resume-bucket/public/*"],
              Effect: "Allow",
            },
            {
              Action: ["s3:PutObject"],
              Resource: ["arn:aws:s3:::outdefine-applicant-resume-bucket/uploads/*"],
              Effect: "Allow",
            },
          ],
        },
      },
    ],
  },
};

// IAM roles
const CognitoIdentityPoolRoles = {
  Type: "AWS::Cognito::IdentityPoolRoleAttachment",
  Properties: {
    IdentityPoolId: {
      Ref: "CognitoIdentityPool",
    },
    Roles: {
      authenticated: {
        "Fn::GetAtt": ["CognitoAuthRole", "Arn"],
      },
    },
  },
};

const ApiGatewayAuthorizer = {
  Type: "AWS::ApiGateway::Authorizer",
  Properties: {
    AuthorizerResultTtlInSeconds: 300,
    IdentitySource: "method.request.header.Authorization",
    Name: `${authorizerName}`,
    RestApiId: {
      "Fn::ImportValue": `${apiGatewayName}`,
    },
    Type: "COGNITO_USER_POOLS",
    ProviderARNs: [
      {
        "Fn::GetAtt": ["CognitoUserPool", "Arn"],
      },
    ],
  },
};

const GatewayResponseDefault = {
  Type: "AWS::ApiGateway::GatewayResponse",
  Properties: {
    ResponseParameters: {
      // eslint-disable-next-line quotes
      'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
      // eslint-disable-next-line quotes
      'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
    },
    ResponseType: "DEFAULT_4XX",
    RestApiId: {
      "Fn::ImportValue": `${apiGatewayName}`,
    },
  },
};

// Outputs
const OutdefApiGatewayRestApiId = {
  Value: {
    Ref: "ApiGatewayRestApi",
  },
  Export: {
    Name: `${apiGatewayName}`,
  },
};

const ApiGatewayAuthorizerId = {
  Description: "Cognito pool outdefine authorizer",
  Value: {
    Ref: "ApiGatewayAuthorizer",
  },
  Export: {
    Name: `${apiAuthorizerName}`,
  },
};

const authorizer = {
  type: "COGNITO_USER_POOLS",
  authorizerId: {
    "Fn::ImportValue": apiAuthorizerName,
  },
};

export {
  CognitoUserPool,
  CognitoPoolClient,
  CognitoIdentityPool,
  CognitoIdentityPoolRoles,
  CognitoAuthRole,
  ApiGatewayAuthorizer,
  GatewayResponseDefault,
  // Output
  OutdefApiGatewayRestApiId,
  ApiGatewayAuthorizerId,
};
