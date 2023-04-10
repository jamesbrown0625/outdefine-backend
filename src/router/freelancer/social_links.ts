import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("freelancer/social_links");
const routePath = getRoutePath("freelancer/profile");

const updateFreelancerProfileSocialLink = {
  handler: `${handlerPath}.updateFreelancerProfileSocialLink`,
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

export { updateFreelancerProfileSocialLink };
