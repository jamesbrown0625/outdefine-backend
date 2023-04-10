import { getDB } from "@model";
import { ENUM_CONTRACT_STATUS } from "src/config/enums";

const { Op } = require("sequelize");

class JobContractService {
  async getTable() {
    return (await getDB()).Contract;
  }

  async getAll(onlyActive?: boolean) {
    const table = await this.getTable();
    return table.findAll({
      where: {
        contract_status: onlyActive
          ? ENUM_CONTRACT_STATUS[0]
          : {
              [Op.not]: null,
            },
      },
      include: [
        {
          model: (await getDB()).Company,
          as: "Company",
        },
        {
          model: (await getDB()).FreelancerProfile,
          as: "FreelancerProfile",
        },
        {
          model: (await getDB()).User,
          as: "User",
        },
      ],
    });
  }

  async getCompaniesFromTalentID(freelancer_id: number) {
    const table = await this.getTable();
    return table.findAll({
      where: {
        freelancer_id,
      },
      include: [
        {
          model: (await getDB()).Company,
          as: "Company",
        },
        {
          model: (await getDB()).FreelancerProfile,
          as: "FreelancerProfile",
        },
        {
          model: (await getDB()).User,
          as: "User",
        },
      ],
    });
  }

  async getTalentsFromCompanyID(company_id: number) {
    const table = await this.getTable();
    return table.findAll({
      where: {
        company_id,
      },
      include: [
        {
          model: (await getDB()).Company,
          as: "Company",
        },
        {
          model: (await getDB()).FreelancerProfile,
          as: "FreelancerProfile",
        },
        {
          model: (await getDB()).User,
          as: "User",
        },
      ],
    });
  }

  async getFromDynamicID(name: string, id: number) {
    const table = await this.getTable();
    return table.findAll({
      where: {
        [name]: id,
      },
      include: [
        {
          model: (await getDB()).Company,
          as: "Company",
        },
        {
          model: (await getDB()).FreelancerProfile,
          as: "FreelancerProfile",
        },
        {
          model: (await getDB()).User,
          as: "User",
        },
      ],
    });
  }

  async create(data: IJobsContract) {
    const table = await this.getTable();
    return await table.create(data);
  }

  async update(data: IJobsContract) {
    const table = await this.getTable();

    return await table.update(data, { where: { id: data.id } });
  }
}

export const jobContractService = new JobContractService();
