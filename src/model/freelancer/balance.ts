import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IFreelancerBalance, SequelizeAttributes } from "@interface";
import { sequelize } from "@config";

const tableName = "freelancer_balance";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IFreelancerBalance> = {
    freelancer_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    balance: { type: DataTypes.INTEGER },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IFreelancerBalance
  }

  const FreelancerBalance: any = <MyModelStatic>sequelize.define(tableName, attributes);

  return FreelancerBalance;
};

export const FreelancerBalance = createDatabase(sequelize);
