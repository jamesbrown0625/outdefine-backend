import { isInDevelopment, PREFIX_RECRUITCRM } from "@config";
import {
  formatExceptionResponse,
  formatJSONResponse,
  getValidUrlFormat,
  middyfyForInvokedFunctions,
  nullToUndefined,
} from "@libs";
import { companyService } from "@service";
import { APIGatewayProxyEvent } from "aws-lambda";
import { recruitCRMCompanyService } from "src/service/recruitcrm";

const companyUpdatedEventHook = middyfyForInvokedFunctions(async (event: APIGatewayProxyEvent) => {
  try {
    if (isInDevelopment()) {
      return formatJSONResponse({
        success: true,
      });
    }

    const companyId = JSON.parse(event.body).company_id;
    const company = await companyService.getOneById(companyId);

    if (company === null) throw new Error("Company does not exist");

    const recruitCompanyName = `${PREFIX_RECRUITCRM}${company.name}`;
    let companyRecruitCRM = {
      company_name: recruitCompanyName,
      city: nullToUndefined(company.city),
      about_company: nullToUndefined(company.summary),
      logo: getValidUrlFormat(company.logo),
      contact_number: nullToUndefined(company.phone_number),
      website: getValidUrlFormat(company.website),
      linkedin: getValidUrlFormat(company.CompanySocialLink?.linkedin_link),
      twitter: getValidUrlFormat(company.CompanySocialLink?.twitter_link),
      updated_on: nullToUndefined(company.updatedAt),
    };

    companyRecruitCRM = JSON.parse(JSON.stringify(companyRecruitCRM));

    let res;

    if (company.recruitcrm_slug === null) {
      // create a new item on recruitcrm, then update slug
      // const result = await recruitCRMCompanyService.getOneByName(company.name)
      // if (result === null) {
      res = await recruitCRMCompanyService.create(companyRecruitCRM);
      // } else {
      // res = await recruitCRMCompanyService.update(result.slug, companyRecruitCRM)
      // }
      await companyService.updateRecruitSlug(company.company_id, res.data.slug);
    } else {
      res = await recruitCRMCompanyService.update(company.recruitcrm_slug, companyRecruitCRM);
    }

    return formatJSONResponse({
      success: true,
      response: res.data,
    });
  } catch (e) {
    return formatExceptionResponse(e);
  }
});

export { companyUpdatedEventHook };
