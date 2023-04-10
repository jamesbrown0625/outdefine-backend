import { isInDevelopment, PREFIX_RECRUITCRM } from "@config";
import {
  formatExceptionResponse,
  formatJSONResponse,
  getValidAvatarUrl,
  invokeLambdaSync,
  middyfyForInvokedFunctions,
  nullToUndefined,
} from "@libs";
import { clientProfileService, companyService } from "@service";
import { APIGatewayProxyEvent } from "aws-lambda";
import { recruitCRMContactService } from "src/service/recruitcrm";

const contactUpdatedEventHook = middyfyForInvokedFunctions(async (event: APIGatewayProxyEvent) => {
  try {
    if (isInDevelopment()) {
      return formatJSONResponse({
        success: true,
      });
    }

    const clientId = JSON.parse(event.body).client_id;
    const client = await clientProfileService.getOneByClientId(clientId);
    if (client === null) throw new Error("Client does not exist");

    let company = await companyService.getOneById(client.company_id);
    if (company === null) throw new Error("Company does not exist");

    if (company.recruitcrm_slug === null) {
      await invokeLambdaSync("companyUpdatedEventHook", {
        body: JSON.stringify({
          company_id: company.company_id,
        }),
      });
      company = await companyService.getOneById(client.company_id);
    }
    if (company.recruitcrm_slug === null) throw new Error("Company slug does not exist");

    const recruitEmail = `${PREFIX_RECRUITCRM}${client.User.email_id}`;
    let contactRecruitCRM = {
      first_name: client.User.first_name,
      last_name: client.User.last_name,
      email: recruitEmail,
      company_slug: company.recruitcrm_slug,
      contact_number: nullToUndefined(client.User.phone_number),
      avatar: getValidAvatarUrl(client.User.avatar),
      city: nullToUndefined(company.city),
      locality: nullToUndefined(company.city),
      address: nullToUndefined(company.city),
      country: nullToUndefined(company.country),
    };
    contactRecruitCRM = JSON.parse(JSON.stringify(contactRecruitCRM));

    let res;
    if (client.recruitcrm_slug === null) {
      // create a new item on recruitcrm, then update slug
      const result = await recruitCRMContactService.getOneByEmail(recruitEmail);
      if (result === null) {
        res = await recruitCRMContactService.create(contactRecruitCRM);
      } else {
        res = await recruitCRMContactService.update(result.slug, contactRecruitCRM);
      }
      await clientProfileService.updateRecruitSlug(client.client_id, res.data.slug);
    } else {
      res = await recruitCRMContactService.update(client.recruitcrm_slug, contactRecruitCRM);
    }

    return formatJSONResponse({
      success: true,
      response: res.data,
    });
  } catch (e) {
    return formatExceptionResponse(e);
  }
});

export { contactUpdatedEventHook };
