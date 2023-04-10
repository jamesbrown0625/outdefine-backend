import { IReferralHistory } from "@interface";
import { getDB } from "@model";

class TalentReferralHistoryService {
  async getTable() {
    return (await getDB()).TalentReferralHistory;
  }

  async getAll() {
    const table = await this.getTable();
    return table.findAll();
  }

  async create(item: IReferralHistory) {
    const table = await this.getTable();
    return await table.create(item);
  }

  async createOrUpdate(item: IReferralHistory) {
    const table = await this.getTable();
    const existingHistory = await table.findOne({
      where: { email: item.email, referral_id: item.referral_id },
    });
    if (existingHistory === null) {
      return await table.create(item);
    }
    return existingHistory;
  }

  async getAllByUserEmail(email: string) {
    const table = await this.getTable();
    const records = await table.findAll({
      where: { email },
    });
    return records;
  }

  async getOnByUserEmail(email: string) {
    const table = await this.getTable();
    const item = await table.findOne({
      where: { email },
    });
    return item;
  }

  async update(item: IReferralHistory) {
    const table = await this.getTable();
    return await table.update(item, { where: { email: item.email } });
  }

  async getAllPendingsByEmail(email: string) {
    const table = await this.getTable();
    return await table.findAll({ where: { email, status: "PENDING" } });
  }

  async getAllByReferralId(referralId: number) {
    const table = await this.getTable();
    return await table.findAll({ where: { referral_id: referralId } });
  }

  async getReferrerEmails(email: string) {
    const table = await this.getTable();
    const item = await table.findOne({
      where: { email, status: "SIGNEDUP" },
      include: [
        {
          model: (await getDB()).TalentReferral,
          as: "talent_referral",
        },
      ],
    });
    if (item !== null) {
      return item;
    }
    return null;
  }
}

export const talentReferralHistoryService = new TalentReferralHistoryService();
