import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IClientProfile, SequelizeAttributes } from "@interface";
import { getEnumField, ENUM_CLIENT_ONBOARDING_STATUS, sequelize } from "@config";

const tableName = "client_profiles";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IClientProfile> = {
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    company_id: { type: DataTypes.INTEGER },
    recruitcrm_slug: { type: DataTypes.STRING },
    position: { type: DataTypes.STRING },
    onboarding_status: getEnumField(ENUM_CLIENT_ONBOARDING_STATUS, "onboarding_status"),
    type: { type: DataTypes.STRING },
    summary: { type: DataTypes.STRING },
    date_invited: { type: DataTypes.DATE },
    invited_by: { type: DataTypes.INTEGER },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IClientProfile
  }

  const ClientProfile: any = <MyModelStatic>sequelize.define(tableName, attributes);
  ClientProfile.associate = (models: any) => {
    ClientProfile.hasOne(models.User, { as: "User", foreignKey: "user_id" });
    ClientProfile.belongsTo(models.User, { as: "Inviter", foreignKey: "invited_by" });
    ClientProfile.belongsTo(models.Company, {
      as: "Company",
      foreignKey: "company_id",
    });
    ClientProfile.hasOne(models.JobPosting, { foreignKey: "client_id" });
  };

  return ClientProfile;
};

export const ClientProfile = createDatabase(sequelize);
