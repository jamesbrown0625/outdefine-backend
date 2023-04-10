import { ICompanyServiceAgreement } from "@interface";
import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { companyServiceAgreementService } from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/**
 * Update company service agreement
 * @params signed_by: number
 * @params company_id: number
 * @params msa_id: number
 * @params agreed: boolean
 * @params authorized: boolean
 */
const updateCompanyServiceAgreement = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input: ICompanyServiceAgreement = JSON.parse(event.body);
      if (input.signed_by === undefined) throw new Error("Signed by property is not provided");
      if (input.company_id === undefined) throw new Error("Company id is not provided");
      if (input.msa_id === undefined) throw new Error("MSA id is not provided");
      if (input.agreed === undefined) throw new Error("MSA id is not provided");
      if (input.authorized === undefined) throw new Error("MSA id is not provided");

      await companyServiceAgreementService.update({
        company_id: input.company_id,
        msa_id: input.msa_id,
        signed_by: input.signed_by,
        agreed: input.agreed,
        authorized: input.authorized,
      });

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { updateCompanyServiceAgreement };
