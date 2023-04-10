import { getDB } from "@model";

class TestRoleMapService {
  async getTable() {
    return (await getDB()).TestRoleMap;
  }

  async getAll() {
    const table = await this.getTable();
    return await table.findAll();
  }

  async getOneByRoleId(roleId: number) {
    const table = await this.getTable();
    return await table.findOne({
      where: {
        role_id: roleId,
      },
    });
  }

  async createIfNotExist(roleId: number) {
    const table = await this.getTable();
    const roleMap = await this.getOneByRoleId(roleId);

    if (roleMap === null) {
      await table.create({
        role_id: roleId,
        test_ids: "",
      });
    }
  }

  async removeTestId(roleId: number, testId: number) {
    const table = await this.getTable();
    const testRole = await this.getOneByRoleId(roleId);

    if (!testRole) {
      throw new Error("Role id is not valid");
    }

    const testIds = testRole.test_ids.split(",");
    const newTestIds = [];
    testIds.forEach((item) => {
      if (item !== "" && item !== testId.toString()) newTestIds.push(item);
    });

    return await table.update(
      {
        test_ids: newTestIds.join(","),
      },
      { where: { role_id: roleId } },
    );
  }

  async addTestId(roleId: number, testId: number) {
    const table = await this.getTable();

    await this.createIfNotExist(roleId);

    const roleMap = await this.getOneByRoleId(roleId);
    if (!roleMap) {
      throw new Error("Role id is not valid");
    }

    if (roleMap.test_ids === null || roleMap.test_ids === "") {
      return await table.update(
        {
          test_ids: testId,
        },
        { where: { role_id: roleId } },
      );
    }

    const testIds = roleMap.test_ids.split(",");
    const newTestIds = [];
    testIds.forEach((item) => {
      if (item !== "" && item !== testId.toString()) newTestIds.push(item);
    });
    newTestIds.push(testId);

    return await table.update(
      {
        test_ids: newTestIds.join(","),
      },
      { where: { role_id: roleId } },
    );
  }
}

export const testRoleMapService = new TestRoleMapService();
