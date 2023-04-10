import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("client/social_links");
const routePath = getRoutePath("client/company");

const updateCompanySocialLink = {
  handler: `${handlerPath}.updateCompanySocialLink`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/updateSocialLink`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export { updateCompanySocialLink };
