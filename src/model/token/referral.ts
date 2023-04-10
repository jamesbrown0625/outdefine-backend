import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IReferral, SequelizeAttributes } from "@interface";

const tableName = "talent_referral";

export default (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IReferral> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    user_id: {
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
    },
    referral_code: {
      type: DataTypes.STRING,
    },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IReferral
  }

  const TalentReferral: any = <MyModelStatic>sequelize.define(tableName, attributes);
  TalentReferral.associate = (models: any) => {
    TalentReferral.hasOne(models.User, {
      as: "User",
      sourceKey: "user_id",
      foreignKey: "user_id",
    });

    TalentReferral.belongsTo(models.User, { foreignKey: "user_id", targetKey: "user_id" });
    TalentReferral.hasMany(models.TalentReferralHistory, {
      foreignKey: "referral_id",
      as: "talent_referral_history",
    });
  };
  return TalentReferral;
};
