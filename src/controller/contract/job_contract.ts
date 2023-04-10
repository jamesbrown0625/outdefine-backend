import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { formatJSONResponse, middyfyForFreelancer } from "@libs";
import { jobContractService } from "@service";

const getAllContracts = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const active_contracts = await jobContractService.getAll(true);

      return formatJSONResponse({
        active: active_contracts,
      });
    } catch (e) {
      return formatJSONResponse({
        status: 500,
        message: `Error Occurred: ${e.message}`,
      });
    }
  },
);

const getCompaniesFromTalentID = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const freelancer_id = event.pathParameters.id;

      if (!freelancer_id) {
        throw new Error("Freelancer id is needed");
      }

      const contracts: Array<IJobsContract> = await jobContractService.getCompaniesFromTalentID(
        parseInt(freelancer_id),
      );

      const actives: Array<IJobsContract> = [];
      const inactives: Array<IJobsContract> = [];

      for (let i = 0; i < contracts.length; i++) {
        if (contracts[i].contract_status === "ACTIVE") {
          actives.push(contracts[i]);
        } else {
          inactives.push(contracts[i]);
        }
      }

      return formatJSONResponse({
        actives,
        inactives,
      });
    } catch (e) {
      return formatJSONResponse({
        status: 500,
        message: `Error Occurred: ${e.message}`,
      });
    }
  },
);

const getTalentsFromCompanyID = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const company_id = event.pathParameters.id;

      if (!company_id) {
        throw new Error("Company id is needed");
      }

      const contracts = await jobContractService.getTalentsFromCompanyID(parseInt(company_id));

      const actives: Array<IJobsContract> = [];
      const inactives: Array<IJobsContract> = [];

      for (let i = 0; i < contracts.length; i++) {
        if (contracts[i].contract_status === "ACTIVE") {
          actives.push(contracts[i]);
        } else {
          inactives.push(contracts[i]);
        }
      }

      return formatJSONResponse({
        actives,
        inactives,
      });
    } catch (e) {
      return formatJSONResponse({
        status: 500,
        message: `Error Occurred: ${e.message}`,
      });
    }
  },
);

const getContractsFromDynamicID = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const id = event.pathParameters.id;
      const from = event.pathParameters.from;

      if (!id) {
        throw new Error("Id is needed");
      }
      if (!from || !["freelancer_id", "company_id"].includes(from)) {
        throw new Error("Invalid request format, which id are you gonna get the contract with?");
      }

      const contracts = await jobContractService.getFromDynamicID(from, parseInt(id));

      const actives: Array<IJobsContract> = [];
      const inactives: Array<IJobsContract> = [];

      for (let i = 0; i < contracts.length; i++) {
        if (contracts[i].contract_status === "ACTIVE") {
          actives.push(contracts[i]);
        } else {
          inactives.push(contracts[i]);
        }
      }

      return formatJSONResponse({
        success: true,
        actives,
        inactives,
      });
    } catch (e) {
      return formatJSONResponse({
        status: 500,
        message: `Error Occurred: ${e.message}`,
      });
    }
  },
);

const updateContract = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const new_contract: IJobsContract = JSON.parse(event.body);

      await jobContractService.update(new_contract);

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatJSONResponse({
        status: 500,
        message: `Error Occurred: ${e.message}`,
      });
    }
  },
);

export {
  getAllContracts,
  getCompaniesFromTalentID,
  getTalentsFromCompanyID,
  updateContract,
  getContractsFromDynamicID,
};
