import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { companyBalanceService, invoiceHistoryService } from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const getCompanyBalance = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "getCompanyBalance";
      const companyId = event.pathParameters.id;

      if (companyId === undefined) {
        throw new Error(`${functionName}: company id should be provided`);
      }

      const balance = await companyBalanceService.getBalance(Number(companyId));
      const totalPendingAmount = await invoiceHistoryService.getTotalInvoicePendingAmount(
        Number(companyId),
      );

      console.log(totalPendingAmount);
      return formatJSONResponse({
        status: 200,
        balance,
        totalPendingAmount,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { getCompanyBalance };
