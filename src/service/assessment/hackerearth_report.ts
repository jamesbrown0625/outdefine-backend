import { IHackerearthReport } from "@interface";
import { getDB } from "@model";

class HackerearthReportService {
  async getTable() {
    return (await getDB()).HackerearthReport;
  }

  async createOrUpdate(item: IHackerearthReport) {
    const table = await this.getTable();
    let report = await table.findOne({
      where: { email: item.email },
    });

    if (report === null) {
      await table.create(item);
    } else {
      await table.update(item, { where: { email: item.email } });
    }

    report = await table.findOne({
      where: { email: item.email },
    });

    return report;
  }

  async createOrUpdateWithEmailAndType(item: IHackerearthReport) {
    const table = await this.getTable();
    let report = await table.findOne({
      where: { email: item.email, type: item.type },
    });

    if (report === null) {
      await table.create(item);
    } else {
      await table.update(item, { where: { email: item.email, type: item.type } });
    }

    report = await table.findOne({
      where: { email: item.email, type: item.type },
    });

    return report;
  }

  async getOneByEmailAndType(emailId: string, type: string) {
    const table = await this.getTable();
    const assessmentInfo = await table.findOne({
      where: { email: emailId, type },
    });

    return assessmentInfo;
  }
}

export const hackerearthReportService = new HackerearthReportService();
