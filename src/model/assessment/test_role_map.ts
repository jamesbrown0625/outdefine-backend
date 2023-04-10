import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { ITestRoleMap, SequelizeAttributes } from "@interface";
import { sequelize } from "@config";

const tableName = "test_role_map";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<ITestRoleMap> = {
    role_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    test_ids: { type: DataTypes.STRING },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ITestRoleMap;
  };

  const TestRoleMap: any = <MyModelStatic>sequelize.define(tableName, attributes);

  return TestRoleMap;
};

export const TestRoleMap = createDatabase(sequelize);
