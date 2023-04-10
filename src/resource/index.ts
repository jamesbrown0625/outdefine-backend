const cors = {
  headers: [
    "Content-Type",
    "X-Amz-Date",
    "Authorization",
    "X-Api-Key",
    "X-Amz-Security-Token",
    "X-Amz-User-Agent",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Methods",
  ],
  // origin: [
  //   'https://main.dywtxfdkz07i2.amplifyapp.com/',
  //   'http://localhost:3000',
  // ],
  origin: "*",
  allowCredentials: false,
};

export const authorizeConfig = {
  name: "authorizer",
  type: "REQUEST",
};

export { cors };
export * as cognito from "./cognito";
export * from "./s3";
export * from "./emails";
