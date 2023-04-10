import { ICompanySocialLink } from "@interface";
import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { companySocialLinkService } from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const updateCompanySocialLink = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input: ICompanySocialLink = JSON.parse(event.body);
      if (input.company_id === undefined) {
        throw new Error("Company id is not provided");
      }

      await companySocialLinkService.update(input);
      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { updateCompanySocialLink };
