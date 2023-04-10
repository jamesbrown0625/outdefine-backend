import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("freelancer/skill");
const routePath = getRoutePath("freelancer/profile/skill");

const updateFreelancerSkills = {
  handler: `${handlerPath}.updateFreelancerSkills`,
  events: [
    {
      http: {
        method: "put",
        path: `${routePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export { updateFreelancerSkills };
