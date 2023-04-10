import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import {
  invoiceHistoryService,
  companyService,
  freelancerProfileService,
  userService,
} from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Resiliencehub } from "aws-sdk";

const getAllInvoices = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  try {
    const history = await invoiceHistoryService.getAll();

    return formatJSONResponse({
      status: 200,
      data: history,
    });
  } catch (e) {
    return formatExceptionResponse(e);
  }
});

const getInvoiceByFreelancer = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "getReferralHistoryByReferrer";
      const freelancer_id = event.pathParameters.id;

      if (freelancer_id === undefined) {
        throw new Error(`${functionName}: freelancer id should be provided`);
      }

      let history = await invoiceHistoryService.getAllByFreelanceId(Number(freelancer_id));
      history = history.map((item) => ({
        slug: item.slug,
        invoice_number: item.invoice_number,
        freelancer_id: item.freelancer_id,
        position: item.position,
        company_id: item.company_id,
        date_issued: item.date_issued,
        date_due: item.date_due,
        date_received: item.date_received,
        charges: item.charges,
        other_charges: item.other_charges,
        amount: item.amount,
        invoice_type: item.invoice_type,
        name: `${item.FreelancerProfile.User.first_name} ${item.FreelancerProfile.User.last_name}`,
        companyName: `${item.Company.name}`,
        avatar: item.FreelancerProfile.User.avatar,
        created_at: item.createdAt,
      }));

      return formatJSONResponse({
        status: 200,
        data: history,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const getInvoiceByCompany = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "getInvoiceByCompany";
      const companyId = event.pathParameters.id;

      if (companyId === undefined) {
        throw new Error(`${functionName}: company id should be provided`);
      }

      let history = await invoiceHistoryService.getAllByCompanyId(Number(companyId));
      history = history.map((item) => ({
        slug: item.slug,
        invoice_number: item.invoice_number,
        freelancer_id: item.freelancer_id,
        position: item.position,
        company_id: item.company_id,
        date_issued: item.date_issued,
        date_due: item.date_due,
        date_received: item.date_received,
        charges: item.charges,
        other_charges: item.other_charges,
        amount: item.amount,
        invoice_type: item.invoice_type,
        name: `${item.FreelancerProfile.User.first_name} ${item.FreelancerProfile.User.last_name}`,
        primary_role: item.FreelancerProfile.PrimaryRole.name,
        avatar: item.FreelancerProfile.User.avatar,
      }));

      return formatJSONResponse({
        status: 200,
        data: history,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 *@params Create invoice that freelancer created
 *@params freelancer_id?: number
 *@params company_id?: number
 *@params position?: string
 *@params date_issued?: Date
 *@params date_due?: Date
 *@params charges?: string
 *@params other_charges?: string
 *@params invoice_type?: string
 *@params amount?: number
 */
const createInvoice = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const freelancerId = input.freelancer_id;
      const companyId = input.company_id;
      const position = input.position;
      const dateIssued = input.date_issued;
      const dateDue = input.date_due;
      const charges = input.charges;
      const otherCharges = input.other_charges;
      const amount = input.amount;
      const invoiceType = input.invoice_type;

      if (freelancerId === undefined) {
        throw new Error("freelancer id is not provided");
      }
      if (companyId === undefined) {
        throw new Error("company id is not provided");
      }
      if (position === undefined) {
        throw new Error("position is not provided");
      }
      if (dateDue === undefined) {
        throw new Error("date due is not provided");
      }
      if (dateIssued === undefined) {
        throw new Error("date issued is not provided");
      }
      if (amount === undefined) {
        throw new Error("amount is not provided");
      }
      if (invoiceType === undefined) {
        throw new Error("Invoice type is not provided");
      }

      const freelancerProfile = await freelancerProfileService.getOne(Number(freelancerId));
      if (freelancerProfile === null) throw new Error("freelancer id is not valid");

      const company = await companyService.getOneById(Number(companyId));
      if (company === null) throw new Error("company id is not valid");

      const user = await userService.getOneByUserId(freelancerId);
      const slug = await invoiceHistoryService.getInvoiceSlug(
        company.name,
        user.first_name,
        user.last_name,
      );

      const result = await invoiceHistoryService.create({
        slug,
        freelancer_id: freelancerId,
        company_id: companyId,
        position,
        date_due: dateDue,
        date_issued: dateIssued,
        charges,
        other_charges: otherCharges,
        amount,
        invoice_type: invoiceType,
      });

      return formatJSONResponse({
        success: true,
        data: result,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 *@params Update invoice detail by freelancer
 *@params invoice_number?: number
 *@params company_id?: number
 *@params position?: string
 *@params date_issued?: Date
 *@params date_due?: Date
 *@params charges?: string
 *@params other_charges?: string
 *@params invoice_type?: string
 *@params amount?: number
 */
const updateInvoiceDetail = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const invoiceNumber = input.invoice_number;
      const position = input.position;
      const dateIssued = input.date_issued;
      const dateDue = input.date_due;
      const charges = input.charges;
      const otherCharges = input.other_charges;
      const amount = input.amount;
      const companyId = input.company_id;
      const invoiceType = input.invoice_type;

      if (invoiceNumber === undefined) {
        throw new Error("Invoice Number is not provided");
      }
      if (position === undefined) {
        throw new Error("position is not provided");
      }
      if (dateDue === undefined) {
        throw new Error("date due is not provided");
      }
      if (dateIssued === undefined) {
        throw new Error("date issued is not provided");
      }
      if (amount === undefined) {
        throw new Error("amount is not provided");
      }
      if (companyId === undefined) {
        throw new Error("company id is not provided");
      }
      if (invoiceType === undefined) {
        throw new Error("Invoice type is not provided");
      }

      const company = await companyService.getOneById(Number(companyId));
      if (company === null) throw new Error("company id is not valid");

      await invoiceHistoryService.update({
        invoice_number: invoiceNumber,
        company_id: companyId,
        position,
        date_due: dateDue,
        date_issued: dateIssued,
        charges,
        other_charges: otherCharges,
        amount,
        invoice_type: invoiceType,
      });

      const result = await invoiceHistoryService.getOne(invoiceNumber);

      return formatJSONResponse({
        success: true,
        data: result,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 *@dev Confirm Invoice, update invoice type and date_received
 *@params invoice_number?: number
 */
const confirmInvoice = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const invoiceNumber = input.invoice_number;

      if (invoiceNumber === undefined) {
        throw new Error("Invoice Number is not provided");
      }

      await invoiceHistoryService.update({
        invoice_number: invoiceNumber,
        date_received: new Date(),
        invoice_type: "paid",
      });

      const result = await invoiceHistoryService.getOne(invoiceNumber);

      return formatJSONResponse({
        success: true,
        data: result,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export {
  getAllInvoices,
  getInvoiceByFreelancer,
  createInvoice,
  updateInvoiceDetail,
  getInvoiceByCompany,
  confirmInvoice,
};
