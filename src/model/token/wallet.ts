import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IWallet, SequelizeAttributes } from "@interface";
import { ENUM_REFERRAL_TYPE, getEnumField } from "@config";

const tableName = "freelancer_wallet";

export default (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IWallet> = {
    user_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    balance: { type: DataTypes.INTEGER },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IWallet
  }

  const FreelancerWallet: any = <MyModelStatic>sequelize.define(tableName, attributes);
  FreelancerWallet.associate = (models: any) => {
    FreelancerWallet.belongsTo(models.User, { foreignKey: "user_id" });
  };
  return FreelancerWallet;
};
