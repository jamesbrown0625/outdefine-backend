import { getRoutePath, getHandlerPath } from "@config";
import { cors } from "@resource";

const handlerPath = getHandlerPath("email/subscribe");
const routePath = getRoutePath("email");

const unsubscribeEmail = {
  handler: `${handlerPath}.unsubscribeEmail`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}/unsubscribe/{email_id}`,
        cors,
      },
    },
  ],
};

export { unsubscribeEmail };
