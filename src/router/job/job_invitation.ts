import { getHandlerPath, getRoutePath, USER_TYPES, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("job/job_invitation");
const routePath = getRoutePath("job/invitation");

const getInvitationsByDynamicId = {
  handler: `${handlerPath}.getInvitationsByDynamicId`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}/{from}/{id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const doInviteTalent = {
  handler: `${handlerPath}.inviteTalent`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/invite`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.CLIENT],
};

const acceptInvitation = {
  handler: `${handlerPath}.acceptInvitation`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/accept`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER],
};

const declineInvitation = {
  handler: `${handlerPath}.declineInvitation`,
  events: [
    {
      http: {
        method: "put",
        path: `${routePath}/decline`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.CLIENT, USER_TYPES_PERMISSION.FREELANCER],
};

export { getInvitationsByDynamicId, doInviteTalent, acceptInvitation, declineInvitation };
