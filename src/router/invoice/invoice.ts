import { getHandlerPath, getRoutePath, USER_TYPES_PERMISSION } from "@config";
import { authorizeConfig, cors } from "@resource";

const handlerPath = getHandlerPath("invoice/invoice");
const routePath = getRoutePath("invoice");

const getAllInvoices = {
  handler: `${handlerPath}.getAllInvoices`,
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

const getInvoiceByFreelancer = {
  handler: `${handlerPath}.getInvoiceByFreelancer`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}/{id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const getInvoiceByCompany = {
  handler: `${handlerPath}.getInvoiceByCompany`,
  events: [
    {
      http: {
        method: "get",
        path: `${routePath}/company/{id}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const createInvoice = {
  handler: `${handlerPath}.createInvoice`,
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

const updateInvoiceDetail = {
  handler: `${handlerPath}.updateInvoiceDetail`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

const confirmInvoice = {
  handler: `${handlerPath}.confirmInvoice`,
  events: [
    {
      http: {
        method: "post",
        path: `${routePath}/confirmInvoice`,
        cors,
        authorizer: authorizeConfig,
      },
    },
  ],
  permission: [USER_TYPES_PERMISSION.FREELANCER, USER_TYPES_PERMISSION.CLIENT],
};

export {
  getAllInvoices,
  getInvoiceByFreelancer,
  createInvoice,
  updateInvoiceDetail,
  getInvoiceByCompany,
  confirmInvoice,
};
