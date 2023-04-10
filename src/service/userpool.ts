import { cognitoIdp } from "@config";

const getUserByEmail = async (userPoolId, email) => {
  const params = {
    UserPoolId: userPoolId,
    Filter: `email = "${email}"`,
  };
  return cognitoIdp.listUsers(params).promise();
};

const getUserByToken = async (token) => {
  const data = await cognitoIdp.getUser({ AccessToken: token }).promise();
  return data;
};

const linkProviderToUser = async (username, userPoolId, providerName, providerUserId) => {
  const params = {
    DestinationUser: {
      ProviderAttributeValue: username,
      ProviderName: "Cognito",
    },
    SourceUser: {
      ProviderAttributeName: "Cognito_Subject",
      ProviderAttributeValue: providerUserId,
      ProviderName: providerName,
    },
    UserPoolId: userPoolId,
  };

  const result = await new Promise((resolve, reject) => {
    cognitoIdp.adminLinkProviderForUser(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });

  return result;
};

export { getUserByEmail, linkProviderToUser, getUserByToken };
