import { getDB } from "@model";
import { IUser } from "@interface";

class UserService {
  async getTable() {
    return (await getDB()).User;
  }

  async getAll() {
    return await this.getAllWithOptions({ order: ["user_id"] });
  }

  async getAllWithOptions(options) {
    const table = await this.getTable();
    return table.findAll(options);
  }

  async getOneByCognitoId(cognitoId) {
    const table = await this.getTable();
    return table.findOne({
      where: { cognito_id: cognitoId },
    });
  }

  async getOneByEmail(emailId) {
    const table = await this.getTable();
    const item = table.findOne({
      where: { email_id: emailId },
    });

    return item;
  }

  async getOneByUserId(userId) {
    const table = await this.getTable();
    const item = await table.findOne({
      where: { user_id: userId },
    });
    return item;
  }

  async create(item: IUser) {
    const table = await this.getTable();
    return await table.create(item);
  }

  async update(item: IUser) {
    const table = await this.getTable();
    return table.update(item, { where: { email_id: item.email_id } });
  }

  async updateById(item: IUser) {
    const table = await this.getTable();
    return table.update(item, { where: { user_id: item.user_id } });
  }

  async getOne(id: number) {
    const table = await this.getTable();
    return await table.findByPk(id);
  }
}

export const userService = new UserService();
