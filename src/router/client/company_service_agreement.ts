import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("client/company_service_agreement");
const routePath = getRoutePath("client/company");

const updateCompanyServiceAgreement = {
  handler: `${handlerPath}.updateCompanyServiceAgreement`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/updateServiceAgreement`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export { updateCompanyServiceAgreement };
