import { IInvoiceHistory } from "@interface";
import { getDB } from "@model";
import CQuery from "src/libs/sequelize/query";
import moment, { Moment } from "moment";
import sequelize from "sequelize";
import { table } from "console";

class InvoiceHistoryService {
  async getTable() {
    return (await getDB()).InvoiceHistory;
  }

  async getAll() {
    const table = await this.getTable();
    return table.findAll();
  }

  async getAllByFreelanceId(freelancer_id: number) {
    const table = await this.getTable();
    const records = await table.findAll({
      include: [
        {
          model: (await getDB()).Company,
          as: "Company",
        },
        {
          model: (await getDB()).FreelancerProfile,
          as: "FreelancerProfile",
          include: [
            {
              model: (await getDB()).JobType,
              as: "JobType",
            },
            {
              model: (await getDB()).Role,
              as: "PrimaryRole",
            },
            {
              model: (await getDB()).User,
              as: "User",
            },
          ],
        },
      ],
      where: { freelancer_id },
    });
    return records;
  }

  async getTotalInvoicePendingAmount(companyId: number) {
    const table = await this.getTable();
    const result = await table.findOne({
      attributes: ["company_id", [sequelize.fn("sum", sequelize.col("amount")), "total_amount"]],
      group: ["company_id"],
      where: {
        date_received: null,
        company_id: companyId,
      },
    });
    return result === null ? 0 : result.dataValues.total_amount;
  }

  async getAllByCompanyId(companyId: number) {
    const table = await this.getTable();
    const records = await table.findAll({
      include: [
        {
          model: (await getDB()).FreelancerProfile,
          as: "FreelancerProfile",
          include: [
            {
              model: (await getDB()).JobType,
              as: "JobType",
            },
            {
              model: (await getDB()).Role,
              as: "PrimaryRole",
            },
            {
              model: (await getDB()).User,
              as: "User",
            },
          ],
        },
      ],
      where: { company_id: companyId },
    });
    return records;
  }

  async getInvoiceSlug(companyName: string, firstName: string, lastName: string) {
    const table = await this.getTable();

    const data = await table.findAll({
      include: [
        {
          model: (await getDB()).Company,
          as: "Company",
        },
        {
          model: (await getDB()).User,
          as: "User",
        },
      ],
      where: {
        "$Company.name$": companyName,
        "$User.first_name$": firstName,
        "$User.last_name$": lastName,
      },
    });

    return `${companyName}-${firstName} ${lastName}-${data.length + 1}`;
  }

  async create(item: IInvoiceHistory) {
    const table = await this.getTable();
    return await table.create(item);
  }

  async createOrUpdate(item: IInvoiceHistory) {
    const table = await this.getTable();
    const existingInvoiceHistory = await table.findOne({
      where: { freelancer_id: item.freelancer_id },
    });
    if (existingInvoiceHistory === null) {
      return await this.create(item);
    }
    return existingInvoiceHistory;
  }

  async update(item: IInvoiceHistory) {
    const table = await this.getTable();
    return await table.update(item, { where: { invoice_number: item.invoice_number } });
  }

  async getOne(id: number) {
    const table = await this.getTable();
    return await table.findByPk(id);
  }

  async getAggregatedDataByRange(params: any, startDate: Moment, endDate: Moment) {
    const table = await this.getTable();
    const records = await table.findAll({
      where: {
        ...params,
        date_received: CQuery.date_in_range(startDate.toString(), endDate.toString()),
      },
    });
    const amount = records.reduce((sum, item) => {
      return sum + item.amount;
    }, 0);
    return amount;
  }

  async getAggregatedDataByYears(companyId: number) {
    const thisYear = moment().startOf("year");
    const pastYear = thisYear.clone().subtract(5, "years");
    const results = [];

    for (let i = pastYear.clone(); i.isBefore(thisYear); i = i.add(1, "years")) {
      const amount = await this.getAggregatedDataByRange(
        { company_id: companyId },
        i.clone(),
        i.clone().add(1, "years"),
      );
      results.push({ date: i.clone().toString(), amount });
    }

    return results;
  }
}

export const invoiceHistoryService = new InvoiceHistoryService();
