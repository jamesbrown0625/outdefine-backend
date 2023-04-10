import { getRoutePath, getHandlerPath } from "@config";
import { cors } from "@resource";

const handlerPath = getHandlerPath("table_sync");
const routePath = getRoutePath("table_sync");
const refreshRoutePath = getRoutePath("table_refresh");

const syncTables = {
  handler: `${handlerPath}.syncTables`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}`,
        cors,
      },
    },
  ],
};

// const refreshTables = {
//   handler: `${handlerPath}.refreshTables`,
//   events: [
//     {
//       http: {
//         method: 'get',
//         path: `${refreshRoutePath}`,
//         cors,
//       },
//     },
//   ],
// }

export { syncTables };
