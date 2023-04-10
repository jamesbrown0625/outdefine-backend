import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getUserByToken, userService } from "@service";
import {
  formatJSONResponse,
  getToken,
  getUserFromContext,
  invokeLambdaSync,
  middyfyForInvokedFunctions,
} from "@libs";
import { isLocalEnvironment, USER_TYPES } from "@config";

const getEmailFromAttributes = (arr) => {
  const filtered = arr.filter((item) => {
    if (item.Name === "email") return true;
    return false;
  });

  return filtered.length == 0 ? null : filtered[0].Value;
};

const authorizedResponse = {
  principalId: "authorize-by-user-type", // The principal user identification associated with the token sent by the client.
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: "Allow",
        Resource: "*",
      },
    ],
  },
};

const authorize = async (event: any) => {
  const { resource, requestContext } = event;

  if (process.env.DISABLE_AUTHORIZE == "yes") return authorizedResponse;

  const authorizationToken = isLocalEnvironment() ? event.authorizationToken : getToken(event);

  const cognitoUser = await getUserByToken(authorizationToken);

  if (cognitoUser === null) {
    throw new Error("Token is not provided or invalid");
  }
  const email = getEmailFromAttributes(cognitoUser.UserAttributes);

  let user = await userService.getOneByEmail(email);
  if (user === null) {
    await userService.create({ email_id: email, user_type: USER_TYPES[0] });
    user = await userService.getOneByEmail(email);
  }

  const result = await invokeLambdaSync("isAuthorized", {
    body: JSON.stringify({
      userType: user.user_type,
      path: resource,
      method: requestContext.httpMethod,
    }),
  });

  const resBody = JSON.parse(result.Payload.toString()).body;
  const isAuthorized = JSON.parse(resBody).isAuthorized;

  if (isAuthorized != true) throw new Error(`User ${email} is not authorized`);

  return {
    ...authorizedResponse,
    context: {
      user: JSON.stringify(user),
    },
  };
};

const authorizationTest = middyfyForInvokedFunctions(async (event: APIGatewayProxyEvent) => {
  try {
    console.log("Authorization Test API");

    const user = getUserFromContext(event);

    console.log("User data : ", user);

    return formatJSONResponse({
      event,
    });
  } catch (e) {
    return formatJSONResponse({
      isAuthorized: false,
    });
  }
});

export { authorize, authorizationTest };
