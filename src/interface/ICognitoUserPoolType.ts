export type ICognitoUserPoolType = {
  handler: string;
  events: [{
    cognitoUserPool: {
      pool: string;
      trigger:
      | "PreSignUp"
      | "PostConfirmation"
      | "PreAuthentication"
      | "PostAuthentication"
      | "PreTokenGeneration"
      | "CustomMessage"
      | "DefineAuthChallenge"
      | "CreateAuthChallenge"
      | "VerifyAuthChallengeResponse"
      | "UserMigration";
      existing?: boolean;
      forceDeploy?: boolean;
    }
  }]
};
