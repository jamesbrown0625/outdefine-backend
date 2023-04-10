import { IWebhookEventLog } from "@interface";
import { getDB } from "@model";

class AssessmentWebhookEventLogsService {
  async getTable() {
    return (await getDB()).AssessmentWebhookEventLogs;
  }

  async getAll() {
    const table = await this.getTable();
    return table.findAll();
  }

  async create(item: IWebhookEventLog) {
    const table = await this.getTable();
    return await table.create(item);
  }

  async createOrUpdate(item: IWebhookEventLog) {
    const table = await this.getTable();
    const Profile = await table.findByPk(item.id);
    if (Profile === null) {
      return await table.create(item);
    }
    return await table.update(item, { where: { id: item.id } });
  }
}

export const assessmentWebhookEventLogService = new AssessmentWebhookEventLogsService();
