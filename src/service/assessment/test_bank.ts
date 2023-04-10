import { IAssessmentTestBank } from "@interface";
import { getDB } from "@model";
import sequelize from "sequelize";

class AssessmentTestBankService {
  async getTable() {
    return (await getDB()).AssessmentTestBank;
  }

  async getAll() {
    const table = await this.getTable();
    return table.findAll();
  }

  async getGeneralCodingTest() {
    const table = await this.getTable();
    return await table.findOne({
      where: {
        mcq_or_coding: "coding",
      },
    });
  }

  async getMcqTests() {
    const table = await this.getTable();
    return await table.findAll({
      where: {
        mcq_or_coding: "mcq",
      },
    });
  }

  async getOneByTestId(testId: number) {
    const table = await this.getTable();
    return await table.findOne({
      where: {
        test_id: testId,
      },
    });
  }

  async createOrUpdate(item: IAssessmentTestBank) {
    const table = await this.getTable();
    const Profile = await table.findByPk(item.test_id);
    if (Profile === null) {
      return await table.create({
        ...item,
      });
    }
    return await table.update(item, { where: { test_id: item.test_id } });
  }

  async getOneByName(name) {
    const lookupValue = name.toLowerCase();

    const table = await this.getTable();
    return table.findOne({
      where: {
        title: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("title")),
          "LIKE",
          "%" + lookupValue + "%",
        ),
      },
    });
  }

  async setToGeneralCoding(testId: number) {
    const table = await this.getTable();

    // Set other tests as mcq
    await table.update({ mcq_or_coding: "mcq" }, { where: {} });

    // Set an active general coding assessment
    await table.update({ mcq_or_coding: "coding" }, { where: { test_id: testId } });
  }

  async remove() {
    const table = await this.getTable();
    await table.destroy({ where: {}, force: true });
  }
}

export const assessmentTestBankService = new AssessmentTestBankService();
