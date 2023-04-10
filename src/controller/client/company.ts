import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { companyService, companySocialLinkService, upload } from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const getAllCompany = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  const all = await companyService.getAll();
  return formatJSONResponse({
    all,
  });
});

/**
 * Update company detail
 * @params company_id: number
 * @params company_name: string
 * @params website: string
 * @params industry: string
 * @params number_of_employees: string
 * @params stage: string
 * @params number_of_open_roles: string
 * @params city: string
 * @params country: string
 * @params dial_code: string
 * @params phone_number: string
 * @params remote_first: boolean
 * @params logo: string
 * @params logo_number: number
 * @params logo_type: boolean
 * @params banner: string
 * @params banner_number: number
 * @params banner_type: boolean
 */
const updateCompanyDetail = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const companyId = input.company_id;
      const companyName = input.company_name;
      const website = input.website;
      const industry = input.industry;
      const numberOfEmployees = input.number_of_employees;
      const stage = input.stage;
      const numberOfOpenRoles = input.number_of_open_roles;
      const city = input.city;
      const country = input.country;
      //const dialCode = input.dial_code
      const phoneNumber = input.phone_number;
      const remoteFirst = input.remote_first;
      const summary = input.summary;
      const CompanySocialLink = input.CompanySocialLink;

      if (companyName === undefined) throw new Error("Company name is not provided");
      if (website === undefined) throw new Error("Website is not provided");
      if (industry === undefined) throw new Error("Industry is not provided");
      if (numberOfEmployees === undefined) throw new Error("Number of employees is not provided");
      if (stage === undefined) throw new Error("Stage is not provided");
      if (numberOfOpenRoles === undefined) throw new Error("Number of Open Role is not provided");
      if (city === undefined) throw new Error("City is not provided");
      if (country === undefined) throw new Error("Country is not provided");
      //if (dialCode === undefined) throw new Error('Dial Code is not provided')
      if (phoneNumber === undefined) throw new Error("Phone number is not provided");
      if (remoteFirst === undefined) throw new Error("Remote first property is not provided");

      if (companyId === undefined) {
        let company = await companyService.getOneByName(companyName);
        if (company != null) throw new Error("A company with same name already exists");
        company = await companyService.create({
          name: companyName,
          website,
          industry,
          number_of_employees: numberOfEmployees,
          stage,
          number_of_open_roles: numberOfOpenRoles,
          city,
          country,
          //dial_code: dialCode,
          phone_number: phoneNumber,
          remote_first: remoteFirst,
          logo: input.logo,
          logo_number: input.logo_number,
          logo_type: input.logo_type,
          banner: input.banner,
          banner_number: input.banner_number,
          banner_type: input.banner_type,
        });
        return formatJSONResponse({
          data: company,
          success: true,
        });
      }

      let company = await companyService.getOneById(companyId);
      if (company === null) throw new Error("Provided Company Id is not provided");

      await companySocialLinkService.update({
        ...CompanySocialLink,
        company_id: company.company_id,
      });
      await companyService.update({
        name: companyName,
        company_id: company.company_id,
        website,
        industry,
        number_of_employees: numberOfEmployees,
        stage,
        number_of_open_roles: numberOfOpenRoles,
        city,
        country,
        //dial_code: dialCode,
        phone_number: phoneNumber,
        remote_first: remoteFirst,
        summary,
        logo: input.logo,
        logo_number: input.logo_number,
        logo_type: input.logo_type,
        banner: input.banner,
        banner_number: input.banner_number,
        banner_type: input.banner_type,
      });

      company = await companyService.getOneById(company.company_id);
      return formatJSONResponse({
        data: company,
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const updateCompanyLogo = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const companyId = Number(event.pathParameters.company_name);
      if (companyId === undefined) {
        throw new Error("Company is not provided");
      }

      const company = await companyService.getOneById(companyId);
      if (company === null) throw new Error("Company doesn't exist");

      // Upload file to S3 and get the link
      const link = await upload(event);
      console.log("Saved link is, ", link);

      await companyService.update({
        company_id: company.company_id,
        logo: link,
      });

      const updatedData = await companyService.getOneById(companyId);

      return formatJSONResponse({
        success: true,
        data: updatedData,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const updateCompanyBanner = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const companyId = Number(event.pathParameters.company_name);
      if (companyId === undefined) {
        throw new Error("Company is not provided");
      }

      const company = await companyService.getOneById(companyId);
      if (company === null) throw new Error("Company doesn't exist");

      // Upload file to S3 and get the link
      const link = await upload(event);
      console.log("Saved link is, ", link);

      await companyService.update({
        company_id: company.company_id,
        banner: link,
      });

      const updatedData = await companyService.getOneById(companyId);

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
 * Get company detail
 * @params id: number
 */
const getCompanyInfo = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const id = event.pathParameters.id;

      if (id === undefined) {
        throw new Error("Company id is required");
      }

      const data = await companyService.getOneById(Number(id));

      return formatJSONResponse({ success: true, data });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export {
  getAllCompany,
  getCompanyInfo,
  updateCompanyDetail,
  updateCompanyLogo,
  updateCompanyBanner,
};
