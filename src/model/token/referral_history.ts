import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IReferralHistory, SequelizeAttributes } from "@interface";
import { ENUM_REFERRAL_TYPE, getEnumField } from "@config";

const tableName = "talent_referral_history";

export default (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IReferralHistory> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    user_id: {
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
    },
    referral_id: {
      type: DataTypes.INTEGER,
    },
    status: { ...getEnumField(ENUM_REFERRAL_TYPE, "status"), defaultValue: ENUM_REFERRAL_TYPE[0] },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IReferralHistory
  }

  const TalentReferralHistory: any = <MyModelStatic>sequelize.define(tableName, attributes);

  TalentReferralHistory.associate = (models: any) => {
    TalentReferralHistory.belongsTo(models.TalentReferral, {
      foreignKey: "referral_id",
      targetKey: "id",
      as: "talent_referral",
    });
  };

  return TalentReferralHistory;
};
