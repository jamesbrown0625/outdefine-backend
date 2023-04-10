import { IFreelancerProfileExperience } from "@interface";
import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { freelancerProfileExperienceService, freelancerProfileService, userService } from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/**
 * @params email_id : string
 * @params experiences: Array<IFreelancerProfileExperience>
 */
const createFreelancerProfileExperience = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const emailId = input.email_id;
      const experiences: Array<IFreelancerProfileExperience> = input.experiences;

      if (emailId === undefined) {
        throw new Error("Email is not provided");
      }
      if (experiences === undefined) {
        throw new Error("Experience parameter is not provided");
      }

      const user = await userService.getOneByEmail(emailId);
      if (user === null) {
        throw new Error(`User doesn't exist`);
      }

      const freelancerProfile = await freelancerProfileService.createOrGetOne(user.user_id);
      if (freelancerProfile === null) {
        throw new Error("Freelancer Profile is undefined");
      }

      // Create Freelancer Profile Experience
      await freelancerProfileService.addFreelancerProfileExperience(freelancerProfile, experiences);

      const updated_experiences = await freelancerProfileExperienceService.getByFreelancerId(
        user.user_id,
      );

      return formatJSONResponse({
        success: true,
        data: updated_experiences,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * @params event.body: Array<IFreelancerProfileExperience>
 */
const updateFreelancerExperienceBatch = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input: Array<IFreelancerProfileExperience> = JSON.parse(event.body);

      for (let i = 0; i < input.length; i++) {
        await freelancerProfileExperienceService.update(input[i]);
      }

      const experiences = await freelancerProfileExperienceService.getByFreelancerId(
        input[0].freelancer_id,
      );

      return formatJSONResponse({
        success: true,
        data: experiences,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const updateFreelancerExperience = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input: IFreelancerProfileExperience = JSON.parse(event.body);
      if (input.id === undefined) {
        throw new Error("Id is not provided");
      }

      await freelancerProfileExperienceService.update(input);
      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * @params freelancer_id, Array<number>
 */
const removeFreelancerProfileExperienceBatch = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input: { freelancer_id: number; data: Array<number> } = JSON.parse(event.body);

      const { freelancer_id, data } = input;

      if (freelancer_id === undefined) {
        throw new Error("Freelancer id is not provided");
      }

      if (data === undefined) {
        throw new Error("Array of id to remove is not provided");
      }

      for (let i = 0; i < data.length; i++) {
        await freelancerProfileExperienceService.secureRemoveById(data[i], freelancer_id);
      }

      const experiences = await freelancerProfileExperienceService.getByFreelancerId(freelancer_id);

      return formatJSONResponse({
        success: true,
        data: experiences,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export {
  createFreelancerProfileExperience,
  updateFreelancerExperienceBatch,
  removeFreelancerProfileExperienceBatch,
  updateFreelancerExperience,
};
