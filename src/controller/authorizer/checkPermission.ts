import { formatJSONResponse, middyfyForInvokedFunctions } from "@libs";
import { APIGatewayProxyEvent } from "aws-lambda";

import * as routers from "@router";
import { USER_TYPES_PERMISSION } from "@config";

const getPermissionByMethodAndPath = (path, method) => {
  const keys = Object.keys(routers);
  let i = 0;
  for (; i < keys.length; i++) {
    const router = routers[keys[i]];

    if (
      router &&
      router.events &&
      router.events[0] &&
      router.events[0].http &&
      router.events[0].http.path &&
      router.events[0].http.method
    ) {
      const httpConfig = router.events[0].http;

      if (httpConfig.method.toLowerCase() !== method.toLowerCase()) continue;

      const routerPath = httpConfig.path.toLowerCase();

      if (path.substring(1).toLowerCase() === routerPath.toLowerCase()) {
        console.log(`[INFO]:: getPermissionByMethodAndPath:: found a match:: ${routerPath}\n`);
        break;
      }
    } else {
      // Handling the scenarios when the route object is not configured in server
      console.log(
        `[DEBUG]:: getPermissionByMethodAndPath:: error in config for route:: ${JSON.stringify(
          router,
        )} for configured path ${path} and method is ${method}\n`,
      );
      continue;
    }
  }

  if (i >= keys.length) {
    console.log("[INFO]:: getPermissionByMethodAndPath:: returning empty permissions \n");
    return "";
  }

  const router = routers[keys[i]];
  console.log(`[INFO]:: getPermissionByMethodAndPath:: ${router.permission}\n`);
  return router.permission;
};

const isAuthorized = middyfyForInvokedFunctions(async (event: APIGatewayProxyEvent) => {
  try {
    const { userType, path, method } = JSON.parse(event.body);

    if (userType === USER_TYPES_PERMISSION.ADMIN) {
      return formatJSONResponse({
        isAuthorized: true,
      });
    }

    const permission = getPermissionByMethodAndPath(path, method);
    if (permission.includes(userType)) {
      return formatJSONResponse({
        isAuthorized: true,
      });
    }

    return formatJSONResponse({
      isAuthorized: false,
    });
  } catch (e) {
    console.log(e);
    return formatJSONResponse({
      isAuthorized: false,
    });
  }
});

export { isAuthorized };
