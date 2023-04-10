import { IFreelancerProfileEducation } from "@interface";
import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { freelancerProfileEducationService, freelancerProfileService, userService } from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/**
 * @params email_id : string
 * @params educations: Array
 */
const createFreelancerProfileEducation = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const emailId = input.email_id;
      const educations: Array<IFreelancerProfileEducation> = input.educations;

      if (emailId === undefined) {
        throw new Error("Email is not provided");
      }
      if (educations === undefined) {
        throw new Error("Education parameter is not provided");
      }

      const user = await userService.getOneByEmail(emailId);
      if (user === null) {
        throw new Error(`User doesn't exist`);
      }

      const freelancerProfile = await freelancerProfileService.createOrGetOne(user.user_id);
      if (freelancerProfile === null) {
        throw new Error("Freelancer Profile is undefined");
      }

      // Create Freelancer Profile Education
      await freelancerProfileService.addFreelancerProfileEducation(freelancerProfile, educations);
      const updated_educations = await freelancerProfileEducationService.getByFreelancerId(
        user.user_id,
      );

      return formatJSONResponse({
        success: true,
        data: updated_educations,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * @params event.body: Array
 */
const updateFreelancerEducationBatch = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input: Array<IFreelancerProfileEducation> = JSON.parse(event.body);

      for (let i = 0; i < input.length; i++) {
        await freelancerProfileEducationService.update(input[i]);
      }

      const educations = await freelancerProfileEducationService.getByFreelancerId(
        input[0].freelancer_id,
      );

      return formatJSONResponse({
        success: true,
        data: educations,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const updateFreelancerEducation = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input: IFreelancerProfileEducation = JSON.parse(event.body);
      if (input.id === undefined) {
        throw new Error("Id is not provided");
      }

      await freelancerProfileEducationService.update(input);
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
const removeFreelancerProfileEducationBatch = middyfyForFreelancer(
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
        await freelancerProfileEducationService.secureRemoveById(data[i], freelancer_id);
      }

      const eudcations = await freelancerProfileEducationService.getByFreelancerId(freelancer_id);

      return formatJSONResponse({
        success: true,
        data: eudcations,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export {
  createFreelancerProfileEducation,
  updateFreelancerEducationBatch,
  updateFreelancerEducation,
  removeFreelancerProfileEducationBatch,
};
