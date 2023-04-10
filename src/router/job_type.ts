import { getRoutePath, getHandlerPath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("job_type");
const routePath = getRoutePath("jobTypes");

const getAllRoles = {
  handler: `${handlerPath}.getAll`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

// const initRoleTable = {
//   handler: `${handlerPath}.initTable`,
//   events: [
//     {
//       http: {
//         method: 'put',
//         path: `${routePath}`,
//         cors,
//         authorizer: authorizeConfig,
//       },
//     },
//   ],
// }

export { getAllRoles };
