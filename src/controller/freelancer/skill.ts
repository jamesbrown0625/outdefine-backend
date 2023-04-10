import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { freelancerProfileService, freelancerSkillService } from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const updateFreelancerSkills = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);

      const freelancer_id = input.freelancer_id;
      const skills = input.skills;
      if (freelancer_id === undefined) {
        throw new Error("Freelancer_id is not provided");
      }
      if (skills === undefined) {
        throw new Error("Skill is not provided");
      }

      await freelancerSkillService.removeAll(freelancer_id);

      for (let i = 0; i < input.skills.length; i++) {
        await freelancerSkillService.create(skills[i]);
      }

      const profile = await freelancerProfileService.getOne(freelancer_id);

      return formatJSONResponse({
        success: true,
        data: profile,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { updateFreelancerSkills };
