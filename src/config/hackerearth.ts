import { isInDevelopment } from "@config";

const CLIENT_ID = "60986dd429f14ebf2ecdf4599932db0957a4ec22ff66.api.hackerearth.com";
const CLIENT_SECRET = "6ee8f988dfe777d22b3a38f9986aa025d3f47cc7";
const DEV_CLIENT_ID = "9f0efb4f1cad9be6e1959a5206b1c2602d596b931997.api.hackerearth.com";
const DEV_CLIENT_SECRET = "7bae239540a9a1ff0d4c56772f2470151bcfeaa2";
const PROD_API_SECRET_KEY = "48ec04faa3063d297e6f178d7ae82c65c3f9ecbb";
const DEV_API_SECRET_KEY = "46faef4fa010d174403aab03d969f57e350710df";

const getHackerearthCredential = () => {
  if (isInDevelopment()) {
    return {
      client_id: DEV_CLIENT_ID,
      client_secret: DEV_CLIENT_SECRET,
    };
  }

  return {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };
};

const getHackerearthApiSecretKey = () => {
  if (isInDevelopment()) return DEV_API_SECRET_KEY;
  return PROD_API_SECRET_KEY;
};

export { getHackerearthApiSecretKey, getHackerearthCredential };
