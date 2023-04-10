import { getHandlerPath, getRoutePath } from "@config";
import { cors } from "@resource";

const handlerPath = getHandlerPath("email/mock");
const routePath = getRoutePath("email");

const sendEmail = {
  handler: `${handlerPath}.sendEmailLambda`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/send`,
        cors,
      },
    },
  ],
};

const createContactListLambda = {
  handler: `${handlerPath}.createContactListLambda`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}/createContact`,
        cors,
      },
    },
  ],
};

export { sendEmail };
