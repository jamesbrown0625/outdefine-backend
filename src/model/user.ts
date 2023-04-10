import { DataTypes, Sequelize, Model, BuildOptions } from "sequelize";

import { IUser, SequelizeAttributes } from "@interface";
import { getEnumField, USER_TYPES, REFERRAL_LINKS } from "@config";

const tableName = "users";

export default (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IUser> = {
    user_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    cognito_id: { type: DataTypes.STRING(56) },
    first_name: { type: DataTypes.STRING(64) },
    last_name: { type: DataTypes.STRING(64) },
    // email_id: { type: DataTypes.STRING(200), unique: true, allowNull: false },
    email_id: { type: DataTypes.STRING(200), unique: true, allowNull: false },
    contact_number: { type: DataTypes.STRING(20) },
    user_type: getEnumField(USER_TYPES, "user_type"),
    referral_link: getEnumField(REFERRAL_LINKS, "referral_link"),
    referred_id: { type: DataTypes.INTEGER },
    is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    pronoun: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    phone_number: { type: DataTypes.STRING },
    dial_code: { type: DataTypes.STRING },

    avatar: { type: DataTypes.STRING },
    avatar_number: { type: DataTypes.INTEGER },
    avatar_type: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

    banner: { type: DataTypes.STRING },
    banner_number: { type: DataTypes.INTEGER },
    banner_type: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

    background_number: { type: DataTypes.INTEGER },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IUser;
  };

  const User: any = <MyModelStatic>sequelize.define(tableName, attributes);
  User.associate = (models: any) => {
    User.hasMany(models.User, { foreignKey: "referred_id", as: "referrals" });
    User.hasOne(models.TalentReferral, { foreignKey: "user_id", as: "talent_referral" });
    User.hasOne(models.CandidateAssessmentInfo, {
      sourceKey: "email_id",
      foreignKey: "email",
      as: "AssessmentInfo",
    });
    User.hasMany(models.FreelancerReward, { foreignKey: "user_id", as: "freelancer_reward" });
    User.hasOne(models.ClientProfile, { foreignKey: "invited_by" });
    User.belongsTo(models.ClientProfile, { foreignKey: "user_id", as: "User" });
    // User.belongsTo(models.FreelancerProfileSocialLink)
    User.hasMany(models.Contract, {
      foreignKey: "user_id",
      as: "JobsContract",
    });
    User.hasMany(models.InvoiceHistory, {
      foreignKey: "freelancer_id",
    });
  };

  return User;
};
