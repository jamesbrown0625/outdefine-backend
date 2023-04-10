import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IFreelancerReward, SequelizeAttributes } from "@interface";
import {
  ENUM_REWARD_SOURCE,
  ENUM_REWARD_STATUS,
  ENUM_REWARD_TRANSACTION_STATUS,
  getEnumField,
} from "@config";

const tableName = "freelancer_reward";

export default (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IFreelancerReward> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    user_id: {
      type: DataTypes.INTEGER,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    date_issued: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    type: getEnumField(ENUM_REWARD_STATUS, "type"),
    received_from: getEnumField(ENUM_REWARD_SOURCE, "received_from"),
    status: getEnumField(ENUM_REWARD_TRANSACTION_STATUS, "status"),
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IFreelancerReward
  }

  const FreelancerReward: any = <MyModelStatic>sequelize.define(tableName, attributes);
  return FreelancerReward;
};
