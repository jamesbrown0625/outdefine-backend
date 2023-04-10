import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { ICompanyBalance, SequelizeAttributes } from "@interface";
import { sequelize } from "@config";

const tableName = "company_balance";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<ICompanyBalance> = {
    company_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    balance: { type: DataTypes.INTEGER },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ICompanyBalance
  }

  const FreelancerBalance: any = <MyModelStatic>sequelize.define(tableName, attributes);

  return FreelancerBalance;
};

export const CompanyBalance = createDatabase(sequelize);
