import { isInDevelopment, PREFIX_RECRUITCRM } from "@config";
import {
  formatExceptionResponse,
  formatJSONResponse,
  getValidUrlFormat,
  middyfyForFreelancer,
  middyfyForInvokedFunctions,
  splitByAndReturn,
  nullToUndefined,
  getValidAvatarUrl,
  getEmploymentTypes,
  nullToEmptyString,
  getSkills,
  getVettedStatusFromField,
} from "@libs";
import { freelancerProfileService, freelancerProfileSocialLinkService, userService } from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { recruitCRMCandidateService } from "src/service/recruitcrm";

const getCandidatesRecruitCRM = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  try {
    const data = await recruitCRMCandidateService.getAllCandidates();

    return formatJSONResponse({
      success: true,
      data,
    });
  } catch (e) {
    return formatExceptionResponse(e);
  }
});

const candidateUpdatedEventHook = middyfyForInvokedFunctions(
  async (event: APIGatewayProxyEvent) => {
    try {
      if (isInDevelopment()) {
        return formatJSONResponse({
          success: true,
        });
      }

      let freelancer = JSON.parse(event.body);

      freelancer = await freelancerProfileService.getOne(freelancer.freelancer_id);
      const user = await userService.getOneByUserId(freelancer.freelancer_id);
      const freelancerSocialLink = await freelancerProfileSocialLinkService.getOneById(
        freelancer.freelancer_id,
      );

      const recruitEmail = `${PREFIX_RECRUITCRM}${user.email_id}`;
      let candidate = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: recruitEmail,
        position: nullToUndefined(freelancer.Role?.name),
        skill: getSkills(freelancer.skills),
        contact_number: nullToUndefined(freelancer.phone_number),
        avatar: getValidAvatarUrl(user.avatar),
        resume: nullToUndefined(freelancer.resume),
        city: nullToUndefined(freelancer.city),
        address: nullToUndefined(freelancer.city),
        github: getValidUrlFormat(freelancerSocialLink?.github_link),
        linkedin: getValidUrlFormat(freelancerSocialLink?.linkedin_link),
        updated_on: nullToUndefined(freelancer.updatedAt),
        work_ex_year: splitByAndReturn(freelancer.years_of_experience, "-", 1),
        salary_expectation: nullToUndefined(freelancer.hourly_rate),
        salary_type: 5,
        custom_fields: [
          {
            field_id: 4, // Country Field
            value: nullToEmptyString(freelancer.country),
          },
          {
            field_id: 3, // Country Field
            value: splitByAndReturn(freelancer.city, ", ", 2),
          },
          {
            field_id: 1, // Vetted Talent
            value: getVettedStatusFromField(freelancer.is_trusted_talent),
          },
          {
            field_id: 2, // Employment Type
            value: getEmploymentTypes(freelancer.roles_open_to),
          },
          {
            field_id: 9, // Created by Outdefine
            value: 1,
          },
        ],
      };

      candidate = JSON.parse(JSON.stringify(candidate));

      let res;

      if (freelancer.recruitcrm_slug === null) {
        // create a new item on recruitcrm, then update slug
        const result = await recruitCRMCandidateService.getOneByEmail(recruitEmail);
        if (result === null) {
          res = await recruitCRMCandidateService.create(candidate);
        } else {
          res = await recruitCRMCandidateService.update(result.slug, candidate);
        }
        await freelancerProfileService.updateRecruitSlug(freelancer.freelancer_id, res.data.slug);
      } else {
        res = await recruitCRMCandidateService.update(freelancer.recruitcrm_slug, candidate);
      }

      return formatJSONResponse({
        success: true,
        response: res.data,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { getCandidatesRecruitCRM, candidateUpdatedEventHook };
