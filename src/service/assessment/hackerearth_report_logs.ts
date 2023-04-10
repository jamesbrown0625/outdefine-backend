import { IHackerearthReportLog } from "@interface";
import { getDB } from "@model";

class HackerearthReportLogService {
  async getTable() {
    return (await getDB()).HackerearthReportLog;
  }

  async getAll() {
    const table = await this.getTable();
    return table.findAll();
  }

  async create(item: IHackerearthReportLog) {
    const table = await this.getTable();
    return await table.create(item);
  }
}

export const hackerearthReportLogService = new HackerearthReportLogService();
