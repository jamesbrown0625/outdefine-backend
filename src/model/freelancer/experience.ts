import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IFreelancerProfileExperience, SequelizeAttributes } from "@interface";
import { getEnumField, ENUM_EXPERIENCE_TYPE, sequelize } from "@config";

const tableName = "freelancer_profile_experience";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IFreelancerProfileExperience> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    freelancer_id: { type: DataTypes.INTEGER },
    company_name: { type: DataTypes.STRING },
    position: { type: DataTypes.STRING },
    term: { type: DataTypes.STRING },
    start_date: { type: DataTypes.DATE },
    end_date: { type: DataTypes.DATE },
    summary: { type: DataTypes.TEXT },

    role: { type: DataTypes.INTEGER },
    skills: { type: DataTypes.STRING },
    experience_type: getEnumField(ENUM_EXPERIENCE_TYPE, "experience_type"),
    currently_working: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IFreelancerProfileExperience
  }

  const FreelancerProfileExperience: any = <MyModelStatic>sequelize.define(tableName, attributes);
  FreelancerProfileExperience.associate = (models: any) => {
    FreelancerProfileExperience.belongsTo(models.FreelancerProfile, { foreignKey: "freelancer_id" });
    FreelancerProfileExperience.hasOne(models.Role, { as: "Role", foreignKey: "role" });
  };

  return FreelancerProfileExperience;
};

export const FreelancerProfileExperience = createDatabase(sequelize);
