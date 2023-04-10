import { formatJSONResponse } from "@libs";
import { getDB } from "@model";
// import { IJob } from '@interface'

export default class JobSaveService {
  async getTable() {
    return (await getDB()).SavedJobs;
  }

  async getAll(freelancer_id: number) {
    const table = await this.getTable();
    return table.findAll({
      where: {
        freelancer_id,
      },
      include: [
        {
          model: (await getDB()).JobPosting,
          as: "PostedJobs",
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
          ],
        },
      ],
    });
  }

  async saveAJob(freelancer_id: number, job_id: number) {
    const table = await this.getTable();
    try {
      const existing_one = await table.findOne({
        where: {
          freelancer_id,
          job_id,
        },
      });

      //console.log(existing_one)

      if (existing_one) {
        //console.log('exist...')
        await table.destroy({
          where: {
            freelancer_id,
            job_id,
          },
        });
        return;
      } else {
        //console.log('creating...')
        await table.create({
          freelancer_id,
          job_id,
          saved_date: new Date().toDateString(),
        });
        return;
      }
    } catch (e) {
      return formatJSONResponse({
        status: 500,
        message: `Error Occurred: ${e.message}`,
      });
    }
  }
}

export const jobSaveService = new JobSaveService();
