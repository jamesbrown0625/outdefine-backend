import { IFreelancerProfileSocialLink } from "@interface";
import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { freelancerProfileSocialLinkService } from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const updateFreelancerProfileSocialLink = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input: IFreelancerProfileSocialLink = JSON.parse(event.body);
      if (input.freelancer_id === undefined) {
        throw new Error("freelancer id is not provided");
      }

      const updated_social = await freelancerProfileSocialLinkService.update(input);
      return formatJSONResponse({
        success: true,
        data: updated_social,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { updateFreelancerProfileSocialLink };
