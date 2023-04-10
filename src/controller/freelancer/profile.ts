import { ENUM_ASSESSMENT_TYPE, getFrontendWebsiteUrl } from "@config";
import { IFreelancerProfile } from "@interface";
import {
  formatExceptionResponse,
  formatJSONResponse,
  invokeLambda,
  middyfyForFreelancer,
} from "@libs";
import {
  freelancerProfileService,
  freelancerProfileSocialLinkService,
  freelancerSkillService,
  upload,
  userService,
  candidateAssessmentInfoService,
  roleService,
  sendEmail,
} from "@service";
import { getWelcomeEmail } from "@utils/email";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const getAllFreelancerProfile = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  const all = await freelancerProfileService.getAll();
  return formatJSONResponse({
    all,
  });
});

const getAllVettedTalent = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  const all = await freelancerProfileService.getAllVettedTalent();
  return formatJSONResponse({
    all,
  });
});

const getAllTalentsWithAssessmentInfo = middyfyForFreelancer(
  async (): Promise<APIGatewayProxyResult> => {
    try {
      const all = await freelancerProfileService.getAllTalentsWithAssessmentInfo();
      return formatJSONResponse({
        all,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const getFreelancerProfileByEmail = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const email = event.pathParameters.email;
      if (email === undefined) {
        throw new Error("Email is not provided");
      }

      const user = await userService.getOneByEmail(email);
      const data = await freelancerProfileService.getOneById(user.user_id);
      return formatJSONResponse({
        data,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const getFreelancerProfile = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const id = event.pathParameters.id;
      if (id === undefined) {
        throw new Error("Id is not provided");
      }

      const data = await freelancerProfileService.getOne(Number(id));
      return formatJSONResponse({
        data,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const createFreelancerProfile = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);

      const data = {
        email_id: input.email_id,
        first_name: input.first_name,
        last_name: input.last_name,
      };
      await userService.update(data);

      // Create One Freelance Profile
      const user = await userService.getOneByEmail(input.email_id);
      const freelancerProfile = await freelancerProfileService.createOneFreelancerProfile({
        freelancer_id: user.user_id,
      });

      // Update Freelancer Profile
      const freelancerProfileData: IFreelancerProfile = input;
      const profile = {
        ...freelancerProfileData,
        freelancer_id: freelancerProfile.freelancer_id,
      };
      await freelancerProfileService.update(profile);

      // Create experience, education, and portfolio
      if (input.experiences !== undefined) {
        await freelancerProfileService.addFreelancerProfileExperience(
          freelancerProfile,
          input.experiences,
        );
      }
      if (input.educations !== undefined) {
        await freelancerProfileService.addFreelancerProfileEducation(
          freelancerProfile,
          input.educations,
        );
      }
      if (input.portfolios !== undefined) {
        await freelancerProfileService.addFreelancerProfilePortfolio(
          freelancerProfile,
          input.portfolios,
        );
      }

      await invokeLambda("candidateUpdatedEventHook", {
        body: JSON.stringify(profile),
      });

      return formatJSONResponse({
        success: true,
        data: freelancerProfile,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const updateFreelancerProfile = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const profile: IFreelancerProfile = JSON.parse(event.body);

      await invokeLambda("candidateUpdatedEventHook", {
        body: JSON.stringify(profile),
      });

      await freelancerProfileService.update(profile);

      const updated_profile = await freelancerProfileService.getOneById(profile.freelancer_id ?? 0);

      return formatJSONResponse({
        success: true,
        data: updated_profile,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const uploadResumeAndSave = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const emailId = event.pathParameters.email_id;

      if (emailId === undefined) {
        throw new Error("Email is not provided");
      }

      const user = await userService.getOneByEmail(emailId);
      if (user === null) {
        throw new Error(`User doesn't exist`);
      }

      // Upload file to S3 and get the link
      const link = await upload(event);
      console.log(link);
      const profile: IFreelancerProfile = {
        freelancer_id: user.user_id,
        resume: link,
      };

      await freelancerProfileService.update(profile);
      await invokeLambda("candidateUpdatedEventHook", {
        body: JSON.stringify(profile),
      });

      const updatedData = await freelancerProfileService.getOne(user.user_id);

      return formatJSONResponse({
        success: true,
        data: updatedData,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Freelancer onboarding apis - step1
 * @params email_id: string
 * @params first_name: string
 * @params last_name: string
 * @params dial_code: string
 * @params phone_number: string
 * @params role: number
 * @params primary_skills: array of numbers
 * @params secondary_skills: array of numbers
 */
const handleFreelancerOnboardingStep1 = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const {
        email_id,
        first_name,
        last_name,
        dial_code,
        phone_number,
        role,
        primary_skills,
        secondary_skills,
      } = JSON.parse(event.body);

      if (!email_id) {
        throw new Error("email field is not provided");
      }
      if (!first_name) {
        throw new Error("first_name field is not provided");
      }
      if (!last_name) {
        throw new Error("last_name field is not provided");
      }
      if (!dial_code) {
        throw new Error("dial_code field is not provided");
      }
      if (!phone_number) {
        throw new Error("phone_number field is not provided");
      }
      if (!role) {
        throw new Error("role id is not provided");
      }
      if (!primary_skills) {
        throw new Error("primary_skills field not provided");
      }
      if (!secondary_skills) {
        throw new Error("secondary_skills field not provided");
      }

      const data = {
        email_id,
        first_name,
        last_name,
        dial_code,
      };
      await userService.update(data);

      // Create One Freelance Profile
      const user = await userService.getOneByEmail(email_id);
      const freelancerProfile = await freelancerProfileService.createOrGetOne(user.user_id);

      const profile = {
        freelancer_id: freelancerProfile.freelancer_id,
        onboarding_status: "STEP1",
        role,
        phone_number,
      };
      await freelancerProfileService.update(profile);

      await invokeLambda("candidateUpdatedEventHook", {
        body: JSON.stringify(profile),
      });

      // Create One Assessment Profile
      await candidateAssessmentInfoService.createOrGetOneByEmail(email_id);

      await freelancerSkillService.removeAll(profile.freelancer_id);
      // Add primary skills
      for (let i = 0; i < primary_skills.length; i++) {
        await freelancerSkillService.create({
          freelancerProfileFreelancerId: profile.freelancer_id,
          skillId: primary_skills[i],
          is_primary: true,
        });
      }

      // Add secondary skills
      for (let i = 0; i < secondary_skills.length; i++) {
        await freelancerSkillService.create({
          freelancerProfileFreelancerId: profile.freelancer_id,
          skillId: secondary_skills[i],
          is_primary: false,
        });
      }

      return formatJSONResponse({
        success: true,
        data: await freelancerProfileService.getOne(profile.freelancer_id),
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Freelancer onboarding apis - step2
 * @params email_id: string
 * @params years_of_experience: string
 * @params level_of_experience: string
 * @params hourly_rate: number
 */
const handleFreelancerOnboardingStep2 = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const { email_id, years_of_experience, level_of_experience, hourly_rate } = JSON.parse(
        event.body,
      );

      if (!email_id) {
        throw new Error("email field is not provided");
      }
      if (!years_of_experience) {
        throw new Error("years_of_experience is not provided");
      }
      if (!level_of_experience) {
        throw new Error("level_of_experience id is not provided");
      }
      if (!hourly_rate) {
        throw new Error("hourly_rate id is not provided");
      }

      // Create One Freelance Profile
      const user = await userService.getOneByEmail(email_id);
      const profile = {
        freelancer_id: user.user_id,
        years_of_experience,
        level_of_experience,
        hourly_rate,
        onboarding_status: "STEP2",
      };
      await freelancerProfileService.update(profile);

      await invokeLambda("candidateUpdatedEventHook", {
        body: JSON.stringify(profile),
      });

      return formatJSONResponse({
        success: true,
        data: await freelancerProfileService.getOne(profile.freelancer_id),
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Freelancer onboarding apis - step3
 * @params email_id: string
 * @params city: string
 * @params country: string
 * @params english_fluency: string
 */
const handleFreelancerOnboardingStep3 = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const { email_id, city, country, english_fluency } = JSON.parse(event.body);

      if (!email_id) {
        throw new Error("email field is not provided");
      }
      if (!city) {
        throw new Error("city is not provided");
      }
      if (!country) {
        throw new Error("country id is not provided");
      }
      if (!english_fluency) {
        throw new Error("english_fluency id is not provided");
      }

      // Create One Freelance Profile
      const user = await userService.getOneByEmail(email_id);
      const profile = {
        freelancer_id: user.user_id,
        city,
        country,
        english_fluency,
        onboarding_status: "STEP3",
      };
      await freelancerProfileService.update(profile);

      await invokeLambda("candidateUpdatedEventHook", {
        body: JSON.stringify(profile),
      });

      return formatJSONResponse({
        success: true,
        data: await freelancerProfileService.getOne(profile.freelancer_id),
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Freelancer onboarding apis - Final
 * @params email_id: string
 * @params website_link: string
 * @params (optional) linkedin_link: string
 * @params (optional) github_link: string
 * @params (optional) talent_source: string
 */
const handleFreelancerOnboardingStep4 = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const { email_id, website_link, linkedin_link, github_link, talent_source } = JSON.parse(
        event.body,
      );

      if (!email_id) {
        throw new Error("email field is not provided");
      }

      // Create One Freelance Profile
      const user = await userService.getOneByEmail(email_id);
      const profile = {
        freelancer_id: user.user_id,
        onboarding_status: "COMPLETED",
      };
      await freelancerProfileService.update(profile);

      await freelancerProfileSocialLinkService.update({
        freelancer_id: user.user_id,
        website_link,
        linkedin_link,
        github_link,
        talent_source,
      });

      await invokeLambda("candidateUpdatedEventHook", {
        body: JSON.stringify(profile),
      });

      // Send Email to the talent
      const emailContent = getWelcomeEmail(getFrontendWebsiteUrl());
      await sendEmail(emailContent, [email_id]);

      return formatJSONResponse({
        success: true,
        data: await freelancerProfileService.getOne(profile.freelancer_id),
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export {
  getAllFreelancerProfile,
  getAllVettedTalent,
  getAllTalentsWithAssessmentInfo,
  getFreelancerProfile,
  getFreelancerProfileByEmail,
  createFreelancerProfile,
  updateFreelancerProfile,
  uploadResumeAndSave,
  handleFreelancerOnboardingStep1,
  handleFreelancerOnboardingStep2,
  handleFreelancerOnboardingStep3,
  handleFreelancerOnboardingStep4,
};
