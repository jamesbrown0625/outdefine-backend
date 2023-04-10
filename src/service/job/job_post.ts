import { IJobsPosted } from "@interface";
import { invokeLambda } from "@libs";
import { getDB } from "@model";
import filterJobPosting from "src/libs/sequelize/filter";
import CQuery from "src/libs/sequelize/query";
import Ranking from "src/libs/sequelize/ranking";
// import { IJob } from '@interface'
const { Op } = require("sequelize");

export default class JobPostService {
  async getTable() {
    return (await getDB()).JobPosting;
  }

  async getAll() {
    const table = await this.getTable();
    return table.findAll();
  }

  async getFilteredData(query: QueryType) {
    const { skip, limit, location, terms, timezone, experience_level, visa_sponsor } = query;
    const table = await this.getTable();
    const _where = {
      status: "ACTIVE",
      term: CQuery.array_of_string(terms),
      timezone: CQuery.array_of_string(timezone),
      location: CQuery.array_of_string(location),
      visa_sponsor: CQuery.existence(visa_sponsor),
      experience_level: CQuery.array_of_string(experience_level),
    };
    return table.findAll({
      offset: skip,
      limit,
      where: _where,
    });
  }

  async getRecommendedJobs(filters: QueryType, profile: any) {
    const table = await this.getTable();

    const results = await table.findAll({
      include: [
        {
          model: (await getDB()).Company,
          as: "Company",
          include: [
            {
              model: (await getDB()).CompanySocialLink,
              as: "CompanySocialLink",
            },
          ],
        },
        {
          model: (await getDB()).ClientProfile,
          as: "ClientProfile",
          include: [
            {
              model: (await getDB()).User,
              as: "User",
            },
          ],
        },
      ],
    });

    const jobs = results
      .filter((item) => {
        const posting: IJobsPosted = item.dataValues;

        return true;
      })
      .map((record) => record.toJSON());

    const recommendedJobs = jobs.map((item) => {
      const score = Ranking.getProfileSimilarity(profile, item);
      const job_with_score = Object.assign(item, { score });

      return job_with_score;
    });

    const filterd_jobs = recommendedJobs.filter((item) => {
      return filterJobPosting(item, filters);
    });

    return filterd_jobs;
  }

  // client side

  async createAJob(data: IJobsPosted) {
    const table = await this.getTable();
    const createdItem = await table.create({ ...data });

    await invokeLambda("jobUpdatedEventHook", {
      body: JSON.stringify(createdItem.dataValues),
    });

    return table.findAll({ where: { company_id: data.company_id } });
  }

  async getOneById(id: number) {
    const table = await this.getTable();
    const item = await table.findByPk(id);

    return item;
  }

  async getByClientId(id: number) {
    const table = await this.getTable();
    return await table.findAll({
      where: {
        client_id: id,
      },
      include: [
        {
          model: (await getDB()).Company,
          as: "Company",
          include: [
            {
              model: (await getDB()).CompanySocialLink,
              as: "CompanySocialLink",
            },
          ],
        },
        {
          model: (await getDB()).ClientProfile,
          as: "ClientProfile",
          include: [
            {
              model: (await getDB()).User,
              as: "User",
            },
          ],
        },
      ],
    });
  }

  async getByDynamicId(name: string, id: number) {
    const table = await this.getTable();
    return await table.findAll({
      where: {
        [name]: id,
      },
      include: [
        {
          model: (await getDB()).Company,
          as: "Company",
          include: [
            {
              model: (await getDB()).CompanySocialLink,
              as: "CompanySocialLink",
            },
          ],
        },
        {
          model: (await getDB()).ClientProfile,
          as: "ClientProfile",
          include: [
            {
              model: (await getDB()).User,
              as: "User",
            },
          ],
        },
      ],
    });
  }

  async deleteByPk(id: number) {
    const table = await this.getTable();

    return await table.destroy({ where: { id } });
  }

  async updateRecruitSlug(id: number, slug: string) {
    const table = await this.getTable();
    await table.update(
      {
        recruitcrm_slug: slug,
      },
      { where: { id } },
    );
  }

  async safeRemoveById(company_id: number, id: number) {
    const table = await this.getTable();

    await table.destroy({ where: { id, company_id } });

    return await table.findAll({
      where: {
        company_id,
      },
    });
  }

  async updateByPk(data: IJobsPosted) {
    const table = await this.getTable();

    await table.update(data, { where: { id: data.id } });

    await invokeLambda("jobUpdatedEventHook", {
      body: JSON.stringify(data),
    });

    return await table.findAll({
      where: {
        company_id: data.company_id,
      },
    });
  }
}

export interface QueryType {
  skip: number
  limit: number
  query: string
  terms?: Array<string>
  hourly_max_rate?: number
  hourly_min_rate?: number
  location?: Array<string>
  job_type: number
  timezone?: Array<string>
  experience_level?: Array<string>
  visa_sponsor?: boolean
}

export const jobPostService = new JobPostService();
