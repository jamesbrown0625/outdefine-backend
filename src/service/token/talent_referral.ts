import { IReferral } from "@interface";
import { getDB } from "@model";
import referralCodeGenerator from "referral-code-generator";

class TalentReferralService {
  async getTable() {
    return (await getDB()).TalentReferral;
  }

  async getAll() {
    const table = await this.getTable();
    return await table.findAll();
  }

  async create(item: IReferral) {
    const table = await this.getTable();
    return await table.create(item);
  }

  async getByReferralCode(code) {
    const table = await this.getTable();
    const item = await table.findOne({ where: { referral_code: code } });
    return item;
  }

  async createAndGenerateCode(item: IReferral) {
    const table = await this.getTable();
    // generate referral code
    const referralCode = referralCodeGenerator.alphaNumeric("uppercase", 8, 1);
    console.log("generated referral code: ", referralCode);
    const newItem = await table.create({ ...item, referral_code: referralCode });
    return newItem;
  }

  async getAllByUserId(user_id: number) {
    const table = await this.getTable();
    const records = await table.findAll({
      where: { user_id },
      include: [
        {
          model: (await getDB()).TalentReferralHistory,
          as: "talent_referral_history",
        },
      ],
    });
    return records;
  }

  async getUserInfoByUserId(user_id: number) {
    const table = await this.getTable();
    const record = await table.findOne({
      where: { user_id },
      include: [
        {
          model: (await getDB()).User,
          as: "User",
        },
      ],
    });
    return record;
  }

  async getOneByUserId(user_id: number) {
    const table = await this.getTable();
    const record = await table.findOne({ where: { user_id } });
    return record;
  }
}

export const talentReferralService = new TalentReferralService();
